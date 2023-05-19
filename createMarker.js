const { cos, sin, pow, atan2, PI: π } = Math

const Physics = {
  G: 6.7 * 10
}

const createMarker = (settings) => {
  // Not confident about physics terminology
  const State = {
    x: settings.x,
    y: settings.y,
    mass: settings.mass,
    radius: settings.radius,
    style: settings.style,
    velocity: settings.velocity,
    angle: settings.angle,
    momentX: settings.velocity * cos(settings.angle),
    momentY: settings.velocity * sin(settings.angle),
    trail: [{
      x: settings.x,
      y: settings.y
    }],
    hasStopped: false
  }

  const velocity = [State.momentX, State.momentY]
  const onStop = settings.onStop || (o=>o)

  const gravitateTo = (attractor) => {
    const force =
      Physics.G *
      State.mass *
      attractor.mass /
      (pow(attractor.x - State.x, 2) + pow(attractor.y - State.y, 2))
    const angle = atan2(attractor.y - State.y, attractor.x - State.x)
    State.momentX += force * cos(angle)
    State.momentY += force * sin(angle)
  }

  const tick = () => {
    State.momentX *= 0.8
    State.momentY *= 0.8
    velocity[0] += State.momentX / 100
    velocity[1] += State.momentY / 100
    State.x += velocity[0] / 100
    State.y += velocity[1] / 100
    State.trail.push({
      x: State.x,
      y: State.y
    })
    State.momentX = 0
    State.momentY = 0
  }

  const stop = () => {
    State.hasStopped = true
  }

  const draw = (ctx) => {
    if (State.hasStopped) {
      onStop(ctx, State)
    } else {
      tick()
    }
    ctx.beginPath()
    ctx.arc(State.x, State.y, State.radius, 0, π * 2)
    ctx.fillStyle = State.style
    ctx.fill()
    ctx.beginPath()
    for (let i = 0; i < State.trail.length; i++) {
      ctx.lineTo(State.trail[i].x, State.trail[i].y)
    }
    ctx.lineWidth = State.radius
    ctx.strokeStyle = State.style
    ctx.stroke()
  }

  return {
    gravitateTo,
    tick,
    draw,
    stop,
    State
  }
}

export default createMarker

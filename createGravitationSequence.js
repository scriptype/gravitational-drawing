const createGravitationSequence = (mass, keyframes) => {
  let frame = 0
  
  const positionProps = ['x', 'y']

  const execFrameProperties = (frameProperties) => {
    for (let prop in frameProperties) {
      if (!frameProperties.hasOwnProperty(prop)) {
        continue
      }
      const value = frameProperties[prop]
      if (typeof value === 'function') {
        if (prop === 'x' || prop === 'y') {
          mass[prop] += value(mass)
        } else {
          mass[prop] *= value(mass)
        }
      } else if (typeof value === 'number') {
        if (prop === 'x' || prop === 'y') {
          mass[prop] += value
        } else {
          mass[prop] *= value
        }
      }
    }
  }

  return () => {
    keyframes.forEach((frameProperties, key) => {
      let match = false
      if (Array.isArray(key)) {
        if (key.length === 2) {
          if (Array.isArray(key[0])) {
            match = (
              frame >= key[0][0] && frame <= key[0][1]
            ) || (
              frame >= key[1][0] && frame <= key[1][1]
            )
          } else {
            match = frame >= key[0] && frame <= key[1]
          }
        } else if (key.length === 1) {
          match = frame === key[0]
        }
      } else if (typeof key === 'number') {
        match = frame === key
      }
      if (match) {
        execFrameProperties(frameProperties)
      }
    })
    return frame++
  }
}

export default createGravitationSequence

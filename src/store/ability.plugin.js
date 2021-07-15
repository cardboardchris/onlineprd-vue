// inspired by https://github.com/stalniy/casl-vue-api-example

export const abilityPlugin = store => {
  const ability = store.getters.ability

  ability.update(store.state.auth.rules)

  // called when the store is initialized
  return store.subscribe((mutation, state) => {
    switch (mutation.type) {
      case 'auth/loginSuccess':
        ability.update(mutation.payload.rules)
        break
      case 'auth/logout':
        ability.update([])
        break
      case 'auth/loginFailure':
        ability.update([])
        break
    }
  })
}

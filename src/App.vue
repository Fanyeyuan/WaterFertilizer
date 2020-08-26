<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/group">Group</router-link> |
      <router-link to="/mapView">MapView</router-link> |
      <router-link to="/param">Param</router-link> |
      <router-link to="/setting">Setting</router-link> |
      <router-link to="/about">About</router-link>
    </div>-->
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  height: 100%;
  color: white;
}

* {
  margin: 0;
  padding: 0;
  user-select: none;
}

a {
  text-decoration: none;
}

ul,
ol {
  list-style: none;
}

body {
  height: 100vh;
  font-size: 16px;
  // overflow: hidden;
}
</style>

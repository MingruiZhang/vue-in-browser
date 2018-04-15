<template>
  <div class="example">
		<div class="hello margin">{{ msg }}</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Hello world!'
    }
  }
}
</script>

<style>
.example {
  color: red;
}
</style>

<style>
.margin {
  margin-top: 10px;
}
</style>

<style>
.hello {
  opacity:0;
}
</style>

<template>
  <div class="notification-wrapper">

    <transition name="slide-fade">
      <div class="notification" v-if="notificationText">
        <span class="span-text">{{ notificationText }}</span>
        <span @click="emptyNotificationText" class="material-icons">close</span>
      </div>
    </transition>

  </div>
</template>

<script>
export default {
  name: "MyNotification",

  mounted() {
    let emitter = require('tiny-emitter/instance');
    emitter.on('notify', (text, duration = 5000) => {

      let currentTextEmpty = this.notificationText.length === 0;
      let newNotifTimeout = 0;
      if (!currentTextEmpty) newNotifTimeout = 500; //set a timeout before setting new text (and setting its close delay)


      clearTimeout(this.timeoutCloseNotif);
      this.emptyNotificationText(); //this clears the text and leave animation starts


      clearTimeout(this.timeoutNewNotif);

      this.timeoutNewNotif = setTimeout(() => {
        this.setText(text);
        this.timeoutCloseNotif = setTimeout(this.emptyNotificationText, duration);
      }, newNotifTimeout);

    });
  },

  data() {
    return {
      notificationText: '',
      timeoutCloseNotif: null,
      timeoutNewNotif: null,
    }
  },
  methods: {
    emptyNotificationText: function () {
      this.notificationText = '';
    },

    setText: function (text) {
      this.notificationText = text;
    },
  }
}


</script>

<style scoped>


@import url("https://fonts.googleapis.com/icon?family=Material+Icons");

.slide-fade-enter-active {
  transition: all .4s cubic-bezier(.38, .66, .07, 1.65);
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, -0.37, .38, 1.18);
}

.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateY(50px);
  opacity: 0;
}

.notification-wrapper {
  display: flex;
  justify-content: center;
}

.notification {
  border-radius: 15px;
  display: flex;

  position: fixed;
  bottom: 20px;
  max-width: 500px;
  padding: 20px;

  z-index: 9999;
  background-color: var(--yelow);
  color: #1c1c1c;
}

.notification .material-icons {
  margin-left: 10px;

  cursor: pointer;

  align-self: center;
  justify-self: end;

  transition: opacity .2s ease;

  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}

.notification .material-icons:active {
  transform: scale(.95);
  opacity: .5;
}

.notification .material-icons:hover {
  opacity: 0.5;
}


.notification .span-text {
  text-align: start;
  align-self: center;
  justify-self: start;
  vertical-align: middle;
}

</style>
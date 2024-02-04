import { createApp, defineAsyncComponent } from "vue";
import Load from "./Load.vue";
import "./style.css";
import { Earth } from "./scene/init.mjs";
import { testWorker } from "./scene/workers/index.mjs";
import { testPlaceMark } from "./scene/placemark/index.mjs";

testWorker()

const Loading = defineAsyncComponent({
  loadingComponent: Load,
  async loader() {
    const toAwait = new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

    const earth=await Earth.init()

    Earth.testCloud()
    // testPlaceMark(earth.widget)

    await toAwait;

    const app = await import("./App.vue");

    return app;
  },
});

// createApp(Load).mountd

createApp(Loading).mount("#app");

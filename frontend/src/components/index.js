import Pupop from './Pupop';
import CutPic from './CutPic';

const component = {
  Pupop,
  CutPic
};

export default {
  install (Vue) {
    for (const k in component) {
      Vue.component(k, component[k]);
    }
  }
};


import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      // 'http://ingress-nginx-controller.ingress-nginx works as well
      headers: req.headers,
    });
  } else {
    return axios.create({});
  }
};

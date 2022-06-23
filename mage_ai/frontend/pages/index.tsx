import Router, { useRouter } from 'next/router';
import { useEffect } from 'react';

const Home = () => {
  const router = useRouter();
  const queryParams = router.query;
  const completePath = router.asPath;
  const basePath = completePath.split('?')[0];
  let pathname = '/datasets';
  if (basePath && basePath !== '/') {
    pathname = `${basePath}/datasets`;
  }
  console.log('pathname 1:', pathname);

  const windowDefined = typeof window !== 'undefined';
  if (windowDefined) {
    console.log('window.location.hostname:', window.location.hostname);
    const host = window.location.hostname;
    const hostParts = host.split('.');
    const domain = hostParts[hostParts.length - 1];
    if (domain === 'aws') {
      pathname = 'proxy/5789/datasets';
    }
  }
  console.log('completePath:', completePath);
  console.log('basePath:', basePath);
  console.log('router pathname:', router.pathname);
  console.log('pathname 2:', pathname);
  console.log('FE ---------------------------');

  useEffect(() => {
    Router.push({
      pathname,
      query: queryParams,
    });
  }, []);
};

export default Home;

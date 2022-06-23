import Router, { useRouter } from 'next/router';
import { useEffect } from 'react';

const Home = () => {
  const router = useRouter();
  const queryParams = router.query;
  const completePath = router.asPath;
  const basePath = completePath.split('?')[0];
  let pathname = '/datasets';
  if (basePath && basePath !== '/') {
    pathname = !basePath.includes('/datasets')
      ? `${basePath}/datasets`
      : basePath;
  }

  const windowDefined = typeof window !== 'undefined';
  if (windowDefined) {
    const host = window.location.hostname;
    const hostParts = host.split('.');
    const domain = hostParts[hostParts.length - 1];
    if (domain === 'aws') {
      const basePath = '/proxy/5789';
      pathname = `${basePath}/datasets`;
    }
  }

  useEffect(() => {
    Router.push({
      pathname,
      query: queryParams,
    });
  }, []);
};

export default Home;

import api from '@api';
import { NextRouter } from 'next/router';

export const redirectToFirstPipeline = (router: NextRouter) => {
	const { data: { pipelines } } = api.pipelines.list();
	const pathname = `/pipelines/${pipelines?.[0]}`;
	const query = router.query;

	if (pipelines?.length >= 1) {
		router.push({
			pathname,
			query,
		});
	}
};

from .base import BaseHandler
from mage_ai.data_preparation.models.pipeline import Pipeline
from mage_ai.data_preparation.models.widget import Widget
from mage_ai.data_preparation.repo_manager import get_repo_path


class ApiPipelineWidgetDetailHandler(BaseHandler):
    model_class = Widget

    def put(self, pipeline_uuid, block_uuid):
        pipeline = Pipeline(pipeline_uuid, get_repo_path())
        payload = self.get_payload()

        widget = pipeline.get_block(block_uuid, widget=True)
        if widget is None:
            raise Exception(f'Widget {block_uuid} does not exist in pipeline {pipeline_uuid}')

        widget.update(payload)
        if payload.get('configuration'):
            widget.configuration = payload['configuration']
            pipeline.save()

        self.write(dict(widget=widget.to_dict(include_content=True)))

    def delete(self, pipeline_uuid, block_uuid):
        pipeline = Pipeline(pipeline_uuid, get_repo_path())
        widget = pipeline.get_block(block_uuid, widget=True)
        if widget is None:
            raise Exception(f'widget {block_uuid} does not exist in pipeline {pipeline_uuid}')
        widget.delete()
        self.write(dict(widget=widget.to_dict()))


class ApiPipelineWidgetListHandler(BaseHandler):
    model_class = Widget

    def get(self, pipeline_uuid):
        include_outputs = self.get_bool_argument('include_outputs', True)

        pipeline = Pipeline(pipeline_uuid, get_repo_path())
        collection = [widget.to_dict(
            include_content=True,
            include_outputs=include_outputs,
        ) for widget in pipeline.widgets_by_uuid.values()]

        self.write(dict(widgets=collection))
        self.finish()

    def post(self, pipeline_uuid):
        pipeline = Pipeline(pipeline_uuid, get_repo_path())

        payload = self.get_payload()

        resource = Widget.create(
            payload.get('name') or payload.get('uuid'),
            payload.get('type'),
            get_repo_path(),
            config=payload.get('config'),
            pipeline=pipeline,
            priority=payload.get('priority'),
            upstream_block_uuids=payload.get('upstream_blocks', []),
        )

        self.write(dict(widget=resource.to_dict(include_content=True)))

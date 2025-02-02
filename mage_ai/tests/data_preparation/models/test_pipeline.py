from mage_ai.data_preparation.models.block import Block
from mage_ai.data_preparation.models.pipeline import Pipeline
from mage_ai.data_preparation.models.widget import Widget
from mage_ai.tests.base_test import TestCase
import asyncio
import os
import shutil


class PipelineTest(TestCase):
    def setUp(self):
        self.repo_path = os.getcwd() + '/test'
        if not os.path.exists(self.repo_path):
            os.mkdir(self.repo_path)
        return super().setUp()

    def tearDown(self):
        shutil.rmtree(self.repo_path)
        return super().tearDown()

    def test_create(self):
        pipeline = Pipeline.create('test pipeline', self.repo_path)
        self.assertEqual(pipeline.uuid, 'test_pipeline')
        self.assertEqual(pipeline.name, 'test pipeline')
        self.assertEqual(pipeline.blocks_by_uuid, dict())
        self.assertTrue(os.path.exists(f'{self.repo_path}/pipelines/test_pipeline/__init__.py'))
        self.assertTrue(os.path.exists(f'{self.repo_path}/pipelines/test_pipeline/metadata.yaml'))

    def test_add_block(self):
        self.__create_pipeline_with_blocks('test pipeline 2')
        pipeline = Pipeline('test_pipeline_2', self.repo_path)

        self.assertEquals(pipeline.to_dict(), dict(
            name='test pipeline 2',
            uuid='test_pipeline_2',
            blocks=[
                dict(
                    name='block1',
                    uuid='block1',
                    type='data_loader',
                    status='not_executed',
                    upstream_blocks=[],
                    downstream_blocks=['block2', 'block3'],
                    all_upstream_blocks_executed=True,
                ),
                dict(
                    name='block2',
                    uuid='block2',
                    type='transformer',
                    status='not_executed',
                    upstream_blocks=['block1'],
                    downstream_blocks=['block4'],
                    all_upstream_blocks_executed=False,
                ),
                dict(
                    name='block3',
                    uuid='block3',
                    type='transformer',
                    status='not_executed',
                    upstream_blocks=['block1'],
                    downstream_blocks=['block4'],
                    all_upstream_blocks_executed=False,
                ),
                dict(
                    name='block4',
                    uuid='block4',
                    type='data_exporter',
                    status='not_executed',
                    upstream_blocks=['block2', 'block3'],
                    downstream_blocks=['widget1'],
                    all_upstream_blocks_executed=False,
                ),
            ],
            widgets=[
                dict(
                    name='widget1',
                    uuid='widget1',
                    type='chart',
                    status='not_executed',
                    upstream_blocks=['block4'],
                    downstream_blocks=[],
                    configuration={},
                    all_upstream_blocks_executed=False,
                ),
            ],
        ))

    def test_delete_block(self):
        pipeline = self.__create_pipeline_with_blocks('test pipeline 3')
        block = pipeline.blocks_by_uuid['block4']
        widget = pipeline.widgets_by_uuid['widget1']
        pipeline.delete_block(widget, widget=True)
        pipeline.delete_block(block)
        pipeline = Pipeline('test_pipeline_3', self.repo_path)
        self.assertEquals(pipeline.to_dict(), dict(
            name='test pipeline 3',
            uuid='test_pipeline_3',
            blocks=[
                dict(
                    name='block1',
                    uuid='block1',
                    type='data_loader',
                    status='not_executed',
                    upstream_blocks=[],
                    downstream_blocks=['block2', 'block3'],
                    all_upstream_blocks_executed=True,
                ),
                dict(
                    name='block2',
                    uuid='block2',
                    type='transformer',
                    status='not_executed',
                    upstream_blocks=['block1'],
                    downstream_blocks=[],
                    all_upstream_blocks_executed=False,
                ),
                dict(
                    name='block3',
                    uuid='block3',
                    type='transformer',
                    status='not_executed',
                    upstream_blocks=['block1'],
                    downstream_blocks=[],
                    all_upstream_blocks_executed=False,
                )
            ],
            widgets=[],
        ))

    def test_execute(self):
        pipeline = Pipeline.create('test pipeline 3', self.repo_path)
        block1 = self.__create_dummy_data_loader_block('block1', pipeline)
        block2 = self.__create_dummy_transformer_block('block2', pipeline)
        block3 = self.__create_dummy_transformer_block('block3', pipeline)
        block4 = self.__create_dummy_data_exporter_block('block4', pipeline)
        pipeline.add_block(block1)
        pipeline.add_block(block2, upstream_block_uuids=['block1'])
        pipeline.add_block(block3, upstream_block_uuids=['block1'])
        pipeline.add_block(block4, upstream_block_uuids=['block2', 'block3'])
        asyncio.run(pipeline.execute())
        self.assertEquals(pipeline.to_dict(), dict(
            name='test pipeline 3',
            uuid='test_pipeline_3',
            blocks=[
                dict(
                    name='block1',
                    uuid='block1',
                    type='data_loader',
                    status='executed',
                    upstream_blocks=[],
                    downstream_blocks=['block2', 'block3'],
                    all_upstream_blocks_executed=True,
                ),
                dict(
                    name='block2',
                    uuid='block2',
                    type='transformer',
                    status='executed',
                    upstream_blocks=['block1'],
                    downstream_blocks=['block4'],
                    all_upstream_blocks_executed=True,
                ),
                dict(
                    name='block3',
                    uuid='block3',
                    type='transformer',
                    status='executed',
                    upstream_blocks=['block1'],
                    downstream_blocks=['block4'],
                    all_upstream_blocks_executed=True,
                ),
                dict(
                    name='block4',
                    uuid='block4',
                    type='data_exporter',
                    status='executed',
                    upstream_blocks=['block2', 'block3'],
                    downstream_blocks=[],
                    all_upstream_blocks_executed=True,
                )
            ],
            widgets=[],
        ))

    def test_execute_multiple_paths(self):
        pipeline = Pipeline.create('test pipeline 4', self.repo_path)
        block1 = self.__create_dummy_data_loader_block('block1', pipeline)
        block2 = self.__create_dummy_transformer_block('block2', pipeline)
        block3 = self.__create_dummy_transformer_block('block3', pipeline)
        block4 = self.__create_dummy_data_loader_block('block4', pipeline)
        block5 = self.__create_dummy_transformer_block('block5', pipeline)
        block6 = self.__create_dummy_transformer_block('block6', pipeline)
        block7 = self.__create_dummy_data_exporter_block('block7', pipeline)
        pipeline.add_block(block1)
        pipeline.add_block(block2, upstream_block_uuids=['block1'])
        pipeline.add_block(block3, upstream_block_uuids=['block1'])
        pipeline.add_block(block4)
        pipeline.add_block(block5, upstream_block_uuids=['block4'])
        pipeline.add_block(block6, upstream_block_uuids=['block5'])
        pipeline.add_block(block7, upstream_block_uuids=['block2', 'block3', 'block6'])
        asyncio.run(pipeline.execute())
        self.assertEquals(pipeline.to_dict(), dict(
            name='test pipeline 4',
            uuid='test_pipeline_4',
            blocks=[
                dict(
                    name='block1',
                    uuid='block1',
                    type='data_loader',
                    status='executed',
                    upstream_blocks=[],
                    downstream_blocks=['block2', 'block3'],
                    all_upstream_blocks_executed=True,
                ),
                dict(
                    name='block2',
                    uuid='block2',
                    type='transformer',
                    status='executed',
                    upstream_blocks=['block1'],
                    downstream_blocks=['block7'],
                    all_upstream_blocks_executed=True,
                ),
                dict(
                    name='block3',
                    uuid='block3',
                    type='transformer',
                    status='executed',
                    upstream_blocks=['block1'],
                    downstream_blocks=['block7'],
                    all_upstream_blocks_executed=True,
                ),
                dict(
                    name='block4',
                    uuid='block4',
                    type='data_loader',
                    status='executed',
                    upstream_blocks=[],
                    downstream_blocks=['block5'],
                    all_upstream_blocks_executed=True,
                ),
                dict(
                    name='block5',
                    uuid='block5',
                    type='transformer',
                    status='executed',
                    upstream_blocks=['block4'],
                    downstream_blocks=['block6'],
                    all_upstream_blocks_executed=True,
                ),
                dict(
                    name='block6',
                    uuid='block6',
                    type='transformer',
                    status='executed',
                    upstream_blocks=['block5'],
                    downstream_blocks=['block7'],
                    all_upstream_blocks_executed=True,
                ),
                dict(
                    name='block7',
                    uuid='block7',
                    type='data_exporter',
                    status='executed',
                    upstream_blocks=['block2', 'block3', 'block6'],
                    downstream_blocks=[],
                    all_upstream_blocks_executed=True,
                )
            ],
            widgets=[],
        ))

    def __create_pipeline_with_blocks(self, name):
        pipeline = Pipeline.create(name, self.repo_path)
        block1 = Block.create('block1', 'data_loader', self.repo_path)
        block2 = Block.create('block2', 'transformer', self.repo_path)
        block3 = Block.create('block3', 'transformer', self.repo_path)
        block4 = Block.create('block4', 'data_exporter', self.repo_path)
        widget1 = Widget.create('widget1', 'chart', self.repo_path)
        pipeline.add_block(block1)
        pipeline.add_block(block2, upstream_block_uuids=['block1'])
        pipeline.add_block(block3, upstream_block_uuids=['block1'])
        pipeline.add_block(block4, upstream_block_uuids=['block2', 'block3'])
        pipeline.add_block(widget1, upstream_block_uuids=['block4'], widget=True)
        return pipeline

    def __create_dummy_data_loader_block(self, name, pipeline):
        block = Block.create(name, 'data_loader', self.repo_path, pipeline)
        with open(block.file_path, 'w') as file:
            file.write('''import pandas as pd
@data_loader
def load_data():
    data = {'col1': [1, 1, 3], 'col2': [2, 2, 4]}
    df = pd.DataFrame(data)
    return [df]
            ''')
        return block

    def __create_dummy_transformer_block(self, name, pipeline):
        block = Block.create(name, 'transformer', self.repo_path, pipeline)
        with open(block.file_path, 'w') as file:
            file.write('''import pandas as pd
@transformer
def transform(df):
    return df
            ''')
        return block

    def __create_dummy_data_exporter_block(self, name, pipeline):
        block = Block.create(name, 'data_exporter', self.repo_path, pipeline)
        with open(block.file_path, 'w') as file:
            file.write('''import pandas as pd
@data_exporter
def export_data(df, *args):
    return None
            ''')
        return block

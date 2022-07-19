from .block import Block
from .constants import BlockStatus, BlockType
from mage_ai.shared.hash import ignore_keys, merge_dict


class Widget(Block):
    def __init__(
        self,
        *args,
        **kwargs,
    ):
        super().__init__(*args, **ignore_keys(kwargs, ['configuration']))
        self.configuration = kwargs.get('configuration', {})

    @classmethod
    def create(
        self,
        name,
        block_type,
        repo_path,
        **kwargs,
    ):
        return super().create(
            name,
            block_type,
            repo_path,
            widget=True,
            **kwargs,
        )

    @classmethod
    def block_class_from_type(self, block_type: str) -> str:
        return BLOCK_TYPE_TO_CLASS.get(block_type)

    @classmethod
    def get_block(
        self,
        name,
        uuid,
        block_type,
        status=BlockStatus.NOT_EXECUTED,
        pipeline=None,
        configuration=None,
    ):
        block_class = BLOCK_TYPE_TO_CLASS.get(block_type, Block)
        return block_class(
            name,
            uuid,
            block_type,
            status=status,
            pipeline=pipeline,
            configuration=configuration,
        )

    def delete(self):
        super().delete(widget=True)

    def to_dict(self, **kwargs):
        return merge_dict(super().to_dict(**kwargs), dict(
            configuration=self.configuration,
        ))


class ChartBlock(Widget):
    @property
    def output_variables(self):
        return dict()


BLOCK_TYPE_TO_CLASS = {
    BlockType.CHART: ChartBlock,
}

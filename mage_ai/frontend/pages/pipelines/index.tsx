import { useMutation } from 'react-query';
import { useRouter } from 'next/router';

import Button from '@oracle/elements/Button';
import FlexContainer from '@oracle/components/FlexContainer';
import Headline from '@oracle/elements/Headline';
import Link from '@oracle/elements/Link';
import Spacing from '@oracle/elements/Spacing';
import Text from '@oracle/elements/Text';
import {
  AsideHeaderStyle,
  BeforeStyle,
  MainWrapper,
  MainContentInnerStyle,
} from '@components/TripleLayout/index.style';
import { Add, MageLogo, Pipeline } from '@oracle/icons';
import { UNIT } from '@oracle/styles/units/spacing';
import { onSuccess } from '@api/utils/response';
import { randomNameGenerator } from '@utils/string';
import api from '@api';

const PANEL_WIDTH = 500;

function PipelineDashboard() {
  const router = useRouter();
  const { data: pipelinesData } = api.pipelines.list();
  const pipelines = pipelinesData?.pipelines || [];

  const goToPipeline = (pipelineUUID: string) =>
    router.push('/pipelines/[...slug]', `/pipelines/${pipelineUUID}`);

  const [createPipeline] = useMutation(
    api.pipelines.useCreate(),
    {
      onSuccess: (response: any) => onSuccess(
        response, {
          callback: ({
            pipeline: {
              uuid,
            },
          }) => {
            goToPipeline(uuid);
          },
          onErrorCallback: ({
            error: {
              errors,
              message,
            },
          }) => {
            console.log(errors, message);
          },
        },
      ),
    },
  );

  return (
    <>
      <BeforeStyle style={{ width: `${PANEL_WIDTH}px` }}>
        <AsideHeaderStyle
          style={{
            width: PANEL_WIDTH,
          }}
          visible={false}
        >
          <FlexContainer
            alignItems="center"
            fullHeight
            justifyContent="space-between"
          >
            <Spacing mx={2}>
              <Button
                iconOnly
                noBorder
                noPadding
                notClickable
                transparent
              >
                <MageLogo size={UNIT * 3} />
              </Button>
            </Spacing>
            <Spacing px={1}>
              <Button
                beforeIcon={<Add size={16} />}
                // @ts-ignore
                onClick={() => createPipeline({
                  pipeline: {
                    name: randomNameGenerator(),
                  },
                })}
              >
                <Text monospace>
                  New pipeline
                </Text>
              </Button>
            </Spacing>
          </FlexContainer>
        </AsideHeaderStyle>
        <Spacing pt={1} px={1}>
          <Spacing p={1}>
            <Headline monospace>
              Pipelines
            </Headline>
          </Spacing>
          <FlexContainer flexDirection="column">
            {pipelines.map((pipelineUUID: string) => (
              <FlexContainer alignItems="center" key={pipelineUUID}>
                <Spacing p={1}>
                  <Pipeline />
                </Spacing>
                <Link
                  monospace
                  onClick={() => goToPipeline(pipelineUUID)}
                  preventDefault
                  secondary
                >
                  {pipelineUUID}
                </Link>
              </FlexContainer> 
            ))}
          </FlexContainer>
        </Spacing>
      </BeforeStyle>

      <MainWrapper style={{
        left: PANEL_WIDTH,
        width: `calc(100% - ${PANEL_WIDTH}px)`,
      }}>
        <MainContentInnerStyle>
          <FlexContainer alignItems="center" fullHeight fullWidth justifyContent="center">
            <MageLogo size={200} />
          </FlexContainer>
        </MainContentInnerStyle>
      </MainWrapper>
    </>
  );
}

export default PipelineDashboard;

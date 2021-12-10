import React from 'react';
import { Route, StaticRouter } from 'react-router';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from 'lib/testHelpers';
import { clusterConsumerGroupResetOffsetsPath } from 'lib/paths';
import { consumerGroupPayload } from 'redux/reducers/consumerGroups/__test__/fixtures';
import ResetOffsets from 'components/ConsumerGroups/Details/ResetOffsets/ResetOffsets';
import fetchMock from 'fetch-mock';

const clusterName = 'cluster1';
const { groupId } = consumerGroupPayload;

const selectresetTypeAndPartitions = async (resetType: string) => {
  userEvent.selectOptions(screen.getByLabelText('Reset Type'), resetType);
  userEvent.click(screen.getByText('Select...'));
  await waitFor(() => {
    userEvent.click(screen.getByText('Partition #0'));
  });
};

const renderComponent = () =>
  render(
    <StaticRouter
      location={{
        pathname: clusterConsumerGroupResetOffsetsPath(
          clusterName,
          consumerGroupPayload.groupId
        ),
      }}
    >
      <Route
        path={clusterConsumerGroupResetOffsetsPath(
          ':clusterName',
          ':consumerGroupID'
        )}
      >
        <ResetOffsets />
      </Route>
    </StaticRouter>
  );

describe('ResetOffsets', () => {
  xit('renders progress bar for initial state', () => {
    renderComponent();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  describe('with consumer group', () => {
    it('calls resetConsumerGroupOffsets', async () => {
      fetchMock.getOnce(
        `/api/clusters/${clusterName}/consumer-groups/${groupId}`,
        consumerGroupPayload
      );
      renderComponent();
      const form = await screen.findByRole('form');
      console.log(form);

      await selectresetTypeAndPartitions('EARLIEST');
      await waitFor(() => {
        userEvent.click(screen.getByText('Submit'));
      });
      // expect(mockResetConsumerGroupOffsets).toHaveBeenCalledTimes(1);
      // expect(mockResetConsumerGroupOffsets).toHaveBeenCalledWith(
      //   'testCluster',
      //   'testGroup',
      //   expectedOutputs.EARLIEST
      // );
    });
  });

  describe('on submit', () => {
    describe('with the default ResetType', () => {});

    // describe('with the ResetType set to LATEST', () => {
    //   it('calls resetConsumerGroupOffsets', async () => {
    //     const mockResetConsumerGroupOffsets = jest.fn();
    //     render(
    //       setupWrapper({
    //         resetConsumerGroupOffsets: mockResetConsumerGroupOffsets,
    //       })
    //     );
    //     await selectresetTypeAndPartitions('LATEST');
    //     await waitFor(() => {
    //       userEvent.click(screen.getByText('Submit'));
    //     });
    //     expect(mockResetConsumerGroupOffsets).toHaveBeenCalledTimes(1);
    //     expect(mockResetConsumerGroupOffsets).toHaveBeenCalledWith(
    //       'testCluster',
    //       'testGroup',
    //       expectedOutputs.LATEST
    //     );
    //   });
    // });

    // describe('with the ResetType set to OFFSET', () => {
    //   it('calls resetConsumerGroupOffsets', async () => {
    //     const mockResetConsumerGroupOffsets = jest.fn();
    //     render(
    //       setupWrapper({
    //         resetConsumerGroupOffsets: mockResetConsumerGroupOffsets,
    //       })
    //     );
    //     await selectresetTypeAndPartitions('OFFSET');
    //     await waitFor(() => {
    //       fireEvent.change(screen.getAllByLabelText('Partition #0')[1], {
    //         target: { value: '10' },
    //       });
    //     });
    //     await waitFor(() => {
    //       userEvent.click(screen.getByText('Submit'));
    //     });
    //     expect(mockResetConsumerGroupOffsets).toHaveBeenCalledTimes(1);
    //     expect(mockResetConsumerGroupOffsets).toHaveBeenCalledWith(
    //       'testCluster',
    //       'testGroup',
    //       expectedOutputs.OFFSET
    //     );
    //   });
    // });

    // describe('with the ResetType set to TIMESTAMP', () => {
    //   it('adds error to the page when the input is left empty', async () => {
    //     const mockResetConsumerGroupOffsets = jest.fn();
    //     render(setupWrapper());
    //     await selectresetTypeAndPartitions('TIMESTAMP');
    //     await waitFor(() => {
    //       userEvent.click(screen.getByText('Submit'));
    //     });
    //     expect(mockResetConsumerGroupOffsets).toHaveBeenCalledTimes(0);
    //     expect(
    //       screen.getByText("This field shouldn't be empty!")
    //     ).toBeInTheDocument();
    //   });
    // });
  });
});

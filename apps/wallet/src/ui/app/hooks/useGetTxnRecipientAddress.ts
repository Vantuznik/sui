// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import {
    type SuiTransactionResponse,
    type SuiAddress,
    getTransactions,
    getTransactionSender,
} from '@mysten/sui.js';
import { useMemo } from 'react';

import { getEventsSummary, getAmount } from '_helpers';

type Props = {
    txn: SuiTransactionResponse;
    address: SuiAddress;
};

export function useGetTxnRecipientAddress({ txn, address }: Props) {
    const { effects } = txn;

    const eventsSummary = useMemo(() => {
        const { coins } = getEventsSummary(effects, address);
        return coins;
    }, [effects, address]);

    const [transaction] = getTransactions(txn);
    const amountByRecipient = getAmount(transaction, txn.effects);

    const recipientAddress = useMemo(() => {
        const transferObjectRecipientAddress =
            amountByRecipient &&
            amountByRecipient?.find(
                ({ recipientAddress }) => recipientAddress !== address
            )?.recipientAddress;
        const receiverAddr =
            eventsSummary &&
            eventsSummary.find(
                ({ receiverAddress }) => receiverAddress !== address
            )?.receiverAddress;

        return (
            receiverAddr ??
            transferObjectRecipientAddress ??
            getTransactionSender(txn)
        );
    }, [address, amountByRecipient, eventsSummary, txn]);

    return recipientAddress;
}

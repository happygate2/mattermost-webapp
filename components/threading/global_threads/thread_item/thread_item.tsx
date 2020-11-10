// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {memo, ComponentProps, useCallback, MouseEvent} from 'react';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';

import './thread_item.scss';

import Badge from 'components/widgets/badges/badge';
import Timestamp from 'components/timestamp';
import Avatars from 'components/widgets/users/avatars';
import Button from 'components/threading/common/button';
import SimpleTooltip from 'components/widgets/simple_tooltip';

import ThreadMenu from '../thread_menu';

import {THREADING_TIME} from '../../common/options';

type Props = {
    participants: ComponentProps<typeof Avatars>['users'],
    totalParticipants?: number;
    name: string,
    channelName: string,
    previewText: string,

    lastReplyAt: ComponentProps<typeof Timestamp>['value'],
    newReplies: number,
    newMentions: number,
    totalReplies: number,

    isFollowing: boolean,
    isSaved: boolean,
    isSelected: boolean,

    actions: {
        select: () => void,
        openInChannel: () => void,
    },
} & Pick<ComponentProps<typeof ThreadMenu>, 'actions'>;

const ThreadItem = ({
    participants,
    totalParticipants,
    name,
    channelName,
    previewText,

    lastReplyAt,
    newReplies,
    newMentions,
    totalReplies,

    isSelected,
    isSaved,
    isFollowing,

    actions,

}: Props) => {
    return (
        <article
            className={classNames('ThreadItem', {
                'has-unreads': newReplies,
                'is-selected': isSelected,
            })}
            tabIndex={0}
            onClick={actions.select}
        >
            <h1>
                {Boolean(newMentions || newReplies) && (
                    <div className='indicator'>
                        {newMentions ? (
                            <div className={classNames('dot-mentions', {over: newMentions > 99})}>
                                {Math.min(newMentions, 99)}
                                {newMentions > 99 && '+'}
                            </div>
                        ) : (
                            <div className='dot-unreads'/>
                        )}
                    </div>
                )}
                {name || participants[0].name}
                {Boolean(channelName) && (
                    <Badge
                        onClick={useCallback((e: MouseEvent) => {
                            e.stopPropagation();
                            actions.openInChannel();
                        }, [])}
                    >
                        {channelName}
                    </Badge>
                )}
                <Timestamp
                    className='alt-hidden'
                    value={lastReplyAt}
                    {...THREADING_TIME}
                />
            </h1>
            <span className='menu-anchor alt-visible'>
                <ThreadMenu
                    isSaved={isSaved}
                    isFollowing={isFollowing}
                    hasUnreads={Boolean(newReplies)}
                    actions={actions}
                >
                    <SimpleTooltip
                        id='threadActionMenu'
                        content={(
                            <FormattedMessage
                                id='threading.threadItem.menu'
                                defaultMessage='Actions'
                            />
                        )}
                    >
                        <Button className='Button___icon'>
                            <i className='Icon icon-dots-vertical'/>
                        </Button>
                    </SimpleTooltip>
                </ThreadMenu>
            </span>
            <p>
                {previewText}
            </p>
            {Boolean(totalReplies) && (
                <div className='activity'>
                    <Avatars
                        users={participants}
                        totalUsers={totalParticipants}
                        size='xs'
                    />
                    {newReplies ? (
                        <FormattedMessage
                            id='threading.numNewReplies'
                            defaultMessage='{newReplies, plural, =1 {# new reply} other {# new replies}}'
                            values={{newReplies}}
                        />
                    ) : (
                        <FormattedMessage
                            id='threading.numReplies'
                            defaultMessage='{totalReplies, plural, =0 {Reply} =1 {# reply} other {# replies}}'
                            values={{totalReplies}}
                        />
                    )}
                </div>
            )}
        </article>
    );
};

export default memo(ThreadItem);
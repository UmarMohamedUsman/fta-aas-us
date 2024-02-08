import * as React from 'react';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { IButtonProps } from '@fluentui/react/lib/Button';
import { FocusZone, MessageBar, MessageBarButton, MessageBarType, IMessageBarStyles } from '@fluentui/react';

const overflowProps: IButtonProps = { ariaLabel: 'More commands' };

const stackStyles: Partial<IMessageBarStyles> = {
    actions: {
        display: 'block',
    },
};

interface Ft3asToolbarProps {
    onSelectTemplateClick?: (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement> | undefined) => void;
    onFilter?: (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined) => void;
    onDownloadReviewClick?: (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined) => void;
    onUploadReviewClick?: (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined) => void;
    onUploadGraphQResultClick?: (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined) => void;
    onDownloadCsvClick?: (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined) => void;
    isModified: boolean;
}

interface INotificationProps {
    resetChoice?: () => void;
    action?: string
}

export function Ft3asToolbar(props: Ft3asToolbarProps) {

    const [showNotification, setChoice] = React.useState<boolean | undefined>(false);
    const [action, setAction] = React.useState<string | undefined>(undefined);
    const resetChoice = React.useCallback(() => setChoice(false), []);

    const _onUploadReviewClick = (ev: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined): void => {
        if (props.isModified === true) {
            setChoice(true)
            setAction('upload');
        } else {
            if (props.onUploadReviewClick) {
                props.onUploadReviewClick(ev);
            }
        }
    };

    const _onSelectTemplateClick = (ev: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined): void => {
        if (props.isModified === true) {
            setChoice(true)
            setAction('import');
        } else if (props.onSelectTemplateClick) {
            props.onSelectTemplateClick(ev);
        }
    };

    const _items: ICommandBarItemProps[] = [
        {
            key: 'importChecklist',
            text: 'Import checklist',
            iconProps: { iconName: 'CheckList' },
            cacheKey: 'myCacheKey', // changing this key will invalidate this item's cache
            onClick: _onSelectTemplateClick
        },
        {
            key: 'download',
            text: 'Download responses',
            iconProps: { iconName: 'Download' },
            onClick: props.onDownloadReviewClick
        },
        {
            key: 'uploadFile',
            text: 'Upload responses',
            iconProps: { iconName: 'Upload' },
            onClick: _onUploadReviewClick,
        },
        {
            key: 'excel',
            text: 'Export Excel',
            iconProps: { iconName: 'ExcelDocument' },
            onClick: props.onDownloadCsvClick,
        },
        {
            key: 'filter',
            text: 'Filters',
            iconProps: { iconName: 'Filter' },
            onClick: props.onFilter,
        },
        {
            key: 'graph',
            text: 'Import Graph Query Result',
            iconProps: { iconName: 'Cloudy' },
            onClick: props.onUploadGraphQResultClick
        }
    ];

    const _overflowItems: ICommandBarItemProps[] = [];

    const _proceedClick = (ev: React.MouseEvent<HTMLElement>, action: string | undefined): void => {
        setChoice(false)
        if (action === 'upload' && props.onUploadReviewClick) {
            props.onUploadReviewClick(ev);
        }
        else if (action === 'import' && props.onSelectTemplateClick) {
            props.onSelectTemplateClick(ev);
        }
    };

    const SevereExample = (p: INotificationProps) => (
        <MessageBar
            messageBarType={MessageBarType.severeWarning}
            styles={stackStyles}
            actions={
                <div>
                    <MessageBarButton onClick={(e: React.MouseEvent<HTMLElement>) => _proceedClick(e, p.action)}>Yes</MessageBarButton>
                    <MessageBarButton onClick={p.resetChoice}>No</MessageBarButton>
                </div>
            }
        >
            You will lose the progress if you move away from this screen. Please download the progress if needed. Do you want to continue?

        </MessageBar>
    );

    return (
        <FocusZone>
            <CommandBar
                items={_items}
                overflowItems={_overflowItems}
                overflowButtonProps={overflowProps}
                ariaLabel="Inbox actions"
                primaryGroupAriaLabel="Email actions"
                farItemsGroupAriaLabel="More actions"
            />
            {showNotification && <SevereExample resetChoice={resetChoice} action={action} />}
        </FocusZone>
    );
};
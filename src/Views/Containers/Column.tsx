import * as React from 'react';
import { Column } from '../../Components/Containers/Column';
import { ActionContext } from '../../Contexts/ActionContext';
import { ColumnElement } from '../../Schema/Containers/Column';
import { StyleManager } from '../../Styles/StyleManager';
import { ContentFactory } from '../Factories/ContentFactory';
import { IElementViewProps } from '../Shared/BaseProps';

interface IProps extends IElementViewProps<ColumnElement> {
    theme?: 'default' | 'emphasis';
}

export class ColumnView extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        const { element } = this.props;

        if (!element || !element.isValid) {
            return null;
        }

        const background = element.getBackgroundImageUrl();

        if (background) {
            return (
                <Column
                    vIndex={this.props.vIndex}
                    hIndex={this.props.hIndex}
                    width={StyleManager.getInstance().getColumnWidth(element)}
                    onPress={element.selectAction ? this.onPress : undefined}
                    spacing={StyleManager.getInstance().getSpacing(element.spacing)}
                >
                    {ContentFactory.createBackgroundImageView(this.renderContents(), background)}
                </Column>
            );
        } else {
            return (
                <Column
                    vIndex={this.props.vIndex}
                    hIndex={this.props.hIndex}
                    width={StyleManager.getInstance().getColumnWidth(element)}
                    onPress={element.selectAction ? this.onPress : undefined}
                    spacing={StyleManager.getInstance().getSpacing(element.spacing)}
                >
                    {this.renderContents()}
                </Column>
            );
        }
    }

    private renderContents = () => {
        const { element } = this.props;

        if (!element || !element.isValid) {
            return undefined;
        }

        if (element.items) {
            return element.items.map((content, index) => ContentFactory.createView(content, index, this.props.theme));
        }
        return undefined;
    }

    private onPress = () => {
        let callback = ActionContext.getGlobalInstance().getActionEventHandler(this.props.element.selectAction);
        if (callback) {
            callback();
        }
    }
}

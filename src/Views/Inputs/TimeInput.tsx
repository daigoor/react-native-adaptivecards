import * as React from 'react';
import { Row } from '../../Components/Containers/Row';
import { TimeInput } from '../../Components/Inputs/TimeInput';
import { FormContext } from '../../Contexts/FormContext';
import { TimeInputElement } from '../../Schema/Inputs/TimeInput';
import { StyleManager } from '../../Styles/StyleManager';
import { IElementViewProps } from '../Shared/BaseProps';

interface IProps extends IElementViewProps<TimeInputElement> {
}

interface IState {
    value: string;
}

export class TimeInputView extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        const { element } = this.props;

        if (element && element.isValid) {
            this.state = {
                value: this.props.element.value,
            };
            this.updateStore();
        }
    }

    public render() {
        const { element } = this.props;

        if (!element || !element.isValid) {
            return null;
        }

        return (
            <Row
                vIndex={this.props.vIndex}
                hIndex={this.props.hIndex}
                spacing={StyleManager.getInstance().getSpacing(element.spacing)}
            >
                <TimeInput
                    vIndex={0}
                    hIndex={0}
                    value={this.state.value}
                    onValueChange={this.onValueChange}
                    validateInput={element.validate}
                />
            </Row>
        );
    }

    private onValueChange = (value: string) => {
        this.setState({
            value: value
        }, this.updateStore);
    }

    private updateStore() {
        FormContext.getInstance().updateField(
            this.props.element.id,
            this.state.value,
            this.props.element.validate(this.state.value)
        );
    }
}

import * as React from 'react';

import { DatePickerIOS, Platform, TimePickerAndroid } from 'react-native';
import { StyleManager } from '../../Styles/StyleManager';
import { TimeUtils } from '../../Utils/TimeUtils';
import { ButtonGroup } from '../Containers/ButtonGroup';
import { Card } from '../Containers/Card';
import { ModalBox } from '../Containers/ModalBox';
import { Button } from './Button';

interface IProps {
    value: string;
    show: boolean;
    onValueChange: (value: string) => void;
    onSave: () => void;
    onCancel: () => void;
}

export class TimePanel extends React.Component<IProps> {
    public componentDidUpdate(prevProps: IProps) {
        if (Platform.OS === 'android' && this.props.show && !prevProps.show) {
            this.showPickerAndroid();
        }
    }

    public render() {
        if (Platform.OS === 'ios') {
            return (
                <ModalBox
                    show={this.show}
                >
                    <Card
                        flex={0}
                        fit='content'
                    >
                        <DatePickerIOS
                            date={TimeUtils.extractTime(this.props.value)}
                            mode='time'
                            onDateChange={this.onTimeChangeIos}
                        />
                        <ButtonGroup
                            hasSpacing={true}
                        >
                            {this.renderCancelButton()}
                            {this.renderSaveButton()}
                        </ButtonGroup>
                    </Card>
                </ModalBox>
            );
        }
        return null;
    }

    private renderCancelButton() {
        return (
            <Button
                flex={1}
                title='Cancel'
                color={StyleManager.getColor('accent', 'default', false)}
                fontSize={StyleManager.getFontSize('default')}
                fontWeight={StyleManager.getFontWeight('bolder')}
                backgroundColor={StyleManager.getBackgroundColor('default')}
                textHorizontalAlign='center'
                textVerticalAlign='center'
                paddingTop={6}
                paddingBottom={6}
                paddingLeft={16}
                paddingRight={16}
                onPress={this.onCancel}
            />
        );
    }

    private renderSaveButton() {
        return (
            <Button
                flex={1}
                title='Save'
                color={StyleManager.getColor('accent', 'default', false)}
                fontSize={StyleManager.getFontSize('default')}
                fontWeight={StyleManager.getFontWeight('bolder')}
                backgroundColor={StyleManager.getBackgroundColor('default')}
                textHorizontalAlign='center'
                textVerticalAlign='center'
                paddingTop={6}
                paddingBottom={6}
                paddingLeft={16}
                paddingRight={16}
                onPress={this.onSave}
                style={{
                    borderLeftWidth: 1,
                    borderLeftColor: StyleManager.separatorColor,
                }}
            />
        );
    }

    private async showPickerAndroid() {
        if (Platform.OS === 'android') {
            const now = TimeUtils.extractTime(this.props.value);
            try {
                const { action, hour, minute } = await TimePickerAndroid.open({
                    hour: now.getHours(),
                    minute: now.getMinutes(),
                    is24Hour: true
                });
                if (action === TimePickerAndroid.timeSetAction) {
                    this.onTimeChange(hour, minute);
                    this.onSave();
                }
                if (action === TimePickerAndroid.dismissedAction) {
                    this.setState({
                        showTimePicker: false
                    }, this.onCancel);
                }
            } catch ({ code, message }) {
                console.warn('Cannot open time picker', message);
            }
        }
    }

    private onCancel = () => {
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }

    private onSave = () => {
        if (this.props.onSave) {
            this.props.onSave();
        }
    }

    private onTimeChangeIos = (date: Date) => {
        if (this.props.onValueChange) {
            this.props.onValueChange(TimeUtils.getTimeString(date));
        }
    }

    private onTimeChange = (hour: number, minute: number) => {
        if (this.props.onValueChange) {
            this.props.onValueChange(TimeUtils.composeTimeString(hour, minute));
        }
    }

    private get show() {
        return this.props.show && Platform.OS === 'ios';
    }
}

import m from 'mithril';

import api from 'core/api';
import store from 'core/store';

import { Base, Header } from 'components/*';

import { success, error } from 'ui/toast';

import map from 'lodash-es/map'

export default () => {
	let state = {
		devices: {},
		hasFeature: true
	};

	let fetch = () => {
		api.getAvailablePrinter().then(devices => {
			state.devices = devices ?? {};
		}, error);
	};

	fetch();

	let controls = () => {
		return (
			<div
				className="btn btn-primary"
				onclick={fetch}
			>
				<i className="ion ion-md-refresh" />
			</div>
		);
	};

	let body = () => {
		if (!store.data.settings || !store.data.printer) {
			return (
				<div className="flex-grow-1 flex justify-center items-center">
					<div className="loading loading-lg" />
				</div>
			);
		}

		if (!state.hasFeature) {
			return (
				<div className="h-100 br1 bg-white overflow-auto ba b--black-10 flex justify-center items-center">
					<div className="tc">
						<i className="red f2 ion ion-md-alert" />
						<div className="f5 b">Feature not Enabled</div>
						<div className="black-50">LibUSB is not available in your version of Sales & Dungeons.</div>
					</div>
				</div>
			);
		}

		if (state.devices.length === 0) {
			return (
				<div className="h-100 br1 bg-white overflow-auto ba b--black-10 flex justify-center items-center">
					<div className="tc">
						<i className="red f2 ion ion-md-alert" />
						<div className="f5 b">No Suitable Device Found</div>
						<div className="mw6 black-50">Don't worry! If you plugged the printer in and it is not showing up there is still a chance that printing can work. Please stop by the Discord so we can check your printer!</div>
					</div>
				</div>
			);
		}

		return (
			<div className="h-100 br1 bg-white overflow-auto ba b--black-10">
				{map(state.devices, (available, printerType) => {
					return map(available, (endpoint, name) => {
						return (
							<div className="flex justify-between items-center pa2 bb b--black-05">
								<div className="lh-solid">
									<div className="f6 fw7 mb1">{name}</div>
									<div className="f7 black-50">({printerType}) {endpoint}</div>
								</div>
								<div className="h2 flex justify-between items-center">
									<div
										className="btn btn-success mr2"
										onclick={() => {
											store.data.settings.printerType = printerType;
											store.data.settings.printerEndpoint = endpoint;
											api.saveSettings(store.data.settings).then(() => {
												success('Settings changed');
											}, error);
										}}
									>
										Use
									</div>
								</div>
							</div>
						);
					})
				})}
			</div>
		);
	};

	return {
		view() {
			return (
				<Base active={'devices'}>
					<div className="h-100 flex flex-column">
						<Header title="Devices" subtitle="List possible printing devices that have been found">
							{controls()}
						</Header>
						<div className="flex-grow-1 flex flex-column ph3 pb3 overflow-auto">{body()}</div>
					</div>
				</Base>
			);
		}
	};
};

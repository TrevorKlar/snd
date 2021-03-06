import m from 'mithril';

import api from 'core/api';
import store from 'core/store';
import binder from 'ui/binder';

import { Base, Header, Input, Switch, Select, Form } from 'components/*';

import { success, error } from 'ui/toast';

export default () => {
	let version = () => {
		if (store.data.version === null || store.data.version?.gitCommitHash.length === 0) return null;

		return (
			<div className="white mb2 toast">
				<div className="code f7">
					<div className="white">
						<span className="dib w4">Build </span> : {store.data.version.buildTime}
					</div>
					<div className="white">
						<span className="dib w4">Commit Hash</span> : {store.data.version.gitCommitHash}
					</div>
					<div className="white">
						<span className="dib w4">Branch</span> : {store.data.version.gitBranch}
					</div>
					<div className="white-70 mt1">If you want to submit a bug please provide the above information!</div>
				</div>
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

		if (store.data.settings.stylesheets === null) {
			store.data.settings.stylesheets = [];
		}

		return (
			<div className="overflow-auto flex-grow-1">
				<div className="flex flex-wrap ph3 pt1 pb2">
					<div className="bg-white ph3 pt3 pb2 mt2 ba b--black-10 br1 flex-grow-1 lh-solid flex flex-wrap relative">
						<div className="br2 br--top bl bt br b--black-10 absolute fw7 left-0 panel-title">
							<i className="ion ion-md-print mr1" />
							Printer Settings
						</div>
						<div className="w-50">
							<Form className="mr3 f7 black-70" horizontal={true}>
								<Select label="Printer Type" keys={Object.keys(store.data.printer)} selected={store.data.settings.printerType} labelCol={4} oninput={binder.inputString(store.data.settings, 'printerType')} />
								<Input label="Endpoint" labelCol={4} placeholder="e.g. POS-80" value={store.data.settings.printerEndpoint} oninput={binder.inputString(store.data.settings, 'printerEndpoint')} />
								<div className="mt3 lh-copy">{store.data.printer?.[store.data.settings.printerType]}</div>
							</Form>
						</div>
						<Form className="w-50 f7 black-70" horizontal={true}>
							<Input label="Printing Width" labelCol={4} placeholder="e.g. 384" value={store.data.settings.printerWidth} oninput={binder.inputNumber(store.data.settings, 'printerWidth')} />
							<Input label="Empty Lines Before" labelCol={4} placeholder="e.g. 7" value={store.data.settings.commands.linesBefore} oninput={binder.inputNumber(store.data.settings.commands, 'linesBefore')} />
							<Input label="Empty Lines After" labelCol={4} placeholder="e.g. 7" value={store.data.settings.commands.linesAfter} oninput={binder.inputNumber(store.data.settings.commands, 'linesAfter')} />
						</Form>
						<div className="w-100">
							<div className="divider" />
							<Form className="w-100 form-no-margin" horizontal={true}>
								<Switch label={'Explicit Initialization'} labelCol={4} value={store.data.settings.commands.explicitInit} oninput={binder.checkbox(store.data.settings.commands, 'explicitInit')} />
								<Switch label={'Force Standard Mode'} labelCol={4} value={store.data.settings.commands.forceStandardMode} oninput={binder.checkbox(store.data.settings.commands, 'forceStandardMode')} />
								<Switch label={'Cut After Printing'} labelCol={4} value={store.data.settings.commands.cut} oninput={binder.checkbox(store.data.settings.commands, 'cut')} />
							</Form>
						</div>
					</div>
				</div>
				<div className="flex flex-wrap pa3">
					<div className="bg-white ph3 pt3 pb3 ba b--black-10 br1 flex-grow-1 lh-solid flex flex-wrap relative">
						<div className="br2 br--top bl bt br b--black-10 absolute fw7 left-0 panel-title">
							<i className="ion ion-md-code mr1" />
							Global Stylesheets
						</div>
						<Form className="w-100 pt2">
							{store.data.settings.stylesheets?.map((s, i) => {
								return (
									<div className="flex justify-between">
										<Input value={s} placeholder="e.g. http://unpkg.com/style.css" oninput={binder.inputString(store.data.settings.stylesheets, i)} />
										<div className="btn btn-error ml2" onclick={() => store.data.settings.stylesheets.splice(i, 1)}>
											Delete
										</div>
									</div>
								);
							})}
						</Form>
						<div className="btn btn-success btn-sm" onclick={() => store.data.settings.stylesheets.push('')}>
							New Entry
						</div>
					</div>
				</div>
				<div className="ph3 mt2">{version()}</div>
				<div className="ph3 mt2 pb4">
					Logo Icons made by
					<a href="https://www.flaticon.com/authors/smashicons" title="Smashicons" className="ml1">
						Smashicons
					</a>
					,
					<a href="https://www.flaticon.com/authors/good-ware" title="Good Ware" className="mh1">
						Good Ware
					</a>
					from
					<a href="https://www.flaticon.com/" title="Flaticon" className="mh1">
						www.flaticon.com
					</a>
				</div>
			</div>
		);
	};

	return {
		view(vnode) {
			return (
				<Base active={'settings'}>
					<div className="h-100 flex flex-column">
						<Header title="Settings" subtitle="Configure various aspects">
							<div
								className="btn btn-success"
								onclick={() => {
									api.saveSettings(store.data.settings).then(
										() => {
											success('Settings saved');
										},
										err => {
											error(err);
										}
									);
								}}
							>
								Save Settings
							</div>
						</Header>
						{body()}
					</div>
				</Base>
			);
		}
	};
};

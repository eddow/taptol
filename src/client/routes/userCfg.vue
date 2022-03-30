<template>
	<div class="ui middle aligned center aligned grid user-pass">
		<div class="column">
			<h2 class="ui teal header">
				<div class="content">
					Change pass-phrase
				</div>
			</h2>
			<sform class="ui large form" :config="changePpConfig" @submit="changePp">
				<div class="ui stacked segment">
					<div class="field">
						<div class="ui left icon input">
							<icon c="password" />
							<input type="password" name="oldPass" v-model="oldPass" placeholder="Old pass-phrase">
						</div>
					</div>
					<div class="field">
						<div class="ui left icon input">
							<icon c="password" />
							<input type="password" name="newPass" v-model="newPass" placeholder="New pass-phrase">
						</div>
					</div>
					<div class="field">
						<div class="ui left icon input">
							<icon c="password" />
							<input type="password" name="cnfPass" placeholder="Pass-phrase verification">
						</div>
					</div>
					<button type="submit" :class="[
							'ui fluid large teal submit button',
							submitting.changePp? 'disabled':''
						]">
						Change
					</button>
				</div>

				<div class="ui error message"></div>
			</sform>
			<h2 class="ui teal header">
				<div class="content">
					Delete account
				</div>
			</h2>
			<sform class="ui large form" :config="delConfig" @submit="del">
				<div class="ui stacked segment">
					<div class="field">
						<div class="ui left icon input">
							<icon c="password" />
							<input type="password" name="delPass" v-model="delPass" placeholder="Pass-phrase">
						</div>
					</div>
					<button type="submit" :class="[
							'ui fluid large teal submit button negative',
							submitting.del? 'disabled':''
						]">
						Delete
					</button>
				</div>

				<div class="ui error message"></div>
			</sform>
			<modal v-model="confirmDelete" title="Delete account" :del="true">
				This is not internet: Deleting the account will effectively delete all the data
				associated with this account
				<span v-if="user.role === 'spec'">
					- as well as all your specialist information
				</span>
				!
			</modal>
		</div>
	</div>
</template>
<script lang="ts">
import Vue from 'vue';
import {Component, Inject} from 'vue-property-decorator';
import user from '@/biz/user';

@Component
export default class UserCfg extends Vue {
	@Inject() toast: (message: string, css: string, title?: string)=> void;
	submitting: {changePp: boolean, del: boolean} = {
		changePp: false,
		del: false
	};
	user = user
	oldPass: string = '';
	newPass: string = '';
	delPass: string = '';
	changePpConfig = {
		fields: {
			oldPass: {
				identifier  : 'oldPass',
				rules: [{
					type   : 'empty',
					prompt : 'Please enter your old pass-phrase'
				}]
			},
			newPass: {
				identifier  : 'newPass',
				rules: [{
					type   : 'empty',
					prompt : 'Please enter your pass-phrase'
				}, {
					type   : 'length[6]',
					prompt : 'Your pass-phrase must be at least 6 characters'
				}, {
					type   : 'different[oldPass]',
					prompt : 'Your new pass-phrase should be different than the old one'
				}]
			},
			cnfPass: {
				identifier  : 'cnfPass',
				rules: [{
					type   : 'match[newPass]',
					prompt : 'Your pass-phrase confirmation does not match'
				}]
			}
		}
	};
	delConfig = {
		fields: {
			delPass: {
				identifier  : 'delPass',
				rules: [{
					type   : 'empty',
					prompt : 'Please enter your pass-phrase'
				}]
			}
		}
	};
	async changePp() {
		this.submitting.changePp = true;
		try {
			await user.changePass(this.oldPass, this.newPass);
			this.toast('Pass-phrase successfully changed', 'success');
		} catch (e) {
		} finally {
			this.submitting.changePp = false;
		}
	}
	confirmDelete: ()=> Promise<boolean> = null;
	async del() {
		this.submitting.del = true;
		try {
			if(await this.confirmDelete()) {
				await user.delete(this.delPass);
				user.name = '';
				user.role = 'anon';
				$('#deleteMdl').modal('hide');
				this.toast('Sorry to see you go...', 'warning','Hasta la vista');
			}
		} catch (e) {
		} finally {
			this.submitting.del = false;
		}
	}
}
</script>
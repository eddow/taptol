<template>
	<div class="ui middle aligned center aligned grid user-pass">
		<div class="column">
			<h2 class="ui teal header">
				<div class="content">
					Set password
				</div>
			</h2>
			<sform class="ui large form" :config="formConfig" @submit="submit" focus="name">
				<div class="ui stacked segment">
					<div class="field">
						<div class="ui left icon input">
							<icon c="password" />
							<input type="password" name="passPhrase" v-model="pass" placeholder="Pass-phrase">
						</div>
					</div>
					<div class="field">
						<div class="ui left icon input">
							<icon c="password" />
							<input type="password" name="confirmation" placeholder="Pass-phrase verification">
						</div>
					</div>
					<button type="submit" :class="[
							'ui fluid large teal submit button',
							submitting? 'disabled':''
						]">
						Set password
					</button>
				</div>
				<div class="ui error message"></div>
			</sform>
		</div>
	</div>
</template>
<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import user, {Role, roles} from '@/biz/user';

let availRoles = {};
for(let role in roles) if('adm'!== role) availRoles[role] = roles[role];

@Component
export default class Register extends Vue {
	submitting: boolean = false;
	pass: string = '';
	static params = ['pwCode'];
	@Prop() pwCode: string;
	formConfig = {
		fields: {
			passPhrase: {
				identifier  : 'passPhrase',
				rules: [{
					type   : 'empty',
					prompt : 'Please enter your pass-phrase'
				}, {
					type   : 'length[6]',
					prompt : 'Your pass-phrase must be at least 6 characters'
				}]
			},
			confirmation: {
				identifier  : 'confirmation',
				rules: [{
					type   : 'match[passPhrase]',
					prompt : 'Your pass-phrase confirmation does not match'
				}]
			}
		}
	};
	async submit() {
		this.submitting = true;
		try {
			await user.setPassword(this.pwCode, this.pass);
		} catch (e) {
		} finally {
			this.submitting = false;
		}
	}
}
</script>
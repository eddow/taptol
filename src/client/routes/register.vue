<template>
	<div class="ui middle aligned center aligned grid user-pass">
		<div class="column">
			<h2 class="ui teal header">
				<div class="content">
					Register
				</div>
			</h2>
			<sform class="ui large form" :config="formConfig" @submit="submit"
				:focus="pwType === 'register' ? 'name' : 'email'"
			>
				<div class="ui stacked segment">
					<div v-if="pwType === 'register'" class="field">
						<div class="ui left icon input">
							<icon c="user" />
							<input type="text" name="name" v-model="name" placeholder="Name" ref="name">
						</div>
					</div>
					<div class="field">
						<div class="ui left icon input">
							<icon c="email" />
							<input type="text" name="email" v-model="email" placeholder="E-mail">
						</div>
					</div>
					<div v-if="pwType === 'register'" class="field">
						<div class="ui input">
							<dropdown name="role" :values="roles" v-model="role" />
						</div>
					</div>
					<button type="submit" :class="[
							'ui fluid large teal submit button',
							submitting? 'disabled':''
						]">
						{{pwType === 'register' ? 'Register' : 'Recover pass-phrase'}}
					</button>
				</div>
				<div class="ui error message"></div>
			</sform>
		</div>
	</div>
</template>
<script lang="ts">
import Vue from 'vue';
import {Component, Prop, Inject} from 'vue-property-decorator';
import user, {Role, roles} from '@/biz/user';

let availRoles = {};
for(let role in roles) if('adm'!== role) availRoles[role] = roles[role];

@Component
export default class Register extends Vue {
	@Inject() toast: (message: string, css: string, title?: string)=> void;
	submitting: boolean = false;
	email: string = '';
	name: string = '';
	role: Role = 'cust';
	roles = availRoles
	get pwType(): 'register'|'lost-pw' {
		return <'register'|'lost-pw'>this.$route.name;
	}
	formConfig = {
		fields: {
			name: {
				identifier  : 'name',
				rules: [{
					type   : 'empty',
					prompt : 'Please enter your name'
				}]
			},
			email: {
				identifier  : 'email',
				rules: [{
					type   : 'empty',
					prompt : 'Please enter your e-mail address'
				}, {
					type   : 'email',
					prompt : 'Please enter a valid e-mail'
				}]
			},
			role: {
				identifier  : 'role',
				rules: [{
					type   : 'empty',
					prompt : 'Please choose whether you are a customer or a specialist'
				}]
			}
		}
	};
	async submit() {
		this.submitting = true;
		try {
			switch(this.pwType) {
			case 'register':
				await user.register(this.name, this.email, this.role);
				break;
			case 'lost-pw':
				await user.resetPw(this.email);
				break;
			}
			this.toast(`An email has been sent to ${this.email} .`, 'success');
			this.$router.push(user.home);
		} catch (e) {
		} finally {
			this.submitting = false;
		}
	}
}
</script>
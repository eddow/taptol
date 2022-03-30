<template>
	<div class="ui middle aligned center aligned grid user-pass">
		<div class="column">
			<h2 class="ui teal header">
				<div class="content">
					Log-in
				</div>
			</h2>
			<sform class="ui large form" focus="email" :config="formConfig" @submit="submit">
				<div class="ui stacked segment">
					<div class="field">
						<div class="ui left icon input">
							<icon c="email" />
							<input type="text" name="email" v-model="email" placeholder="E-mail" ref="email">
						</div>
					</div>
					<div class="field">
						<div class="ui left icon input">
							<icon c="password" />
							<input type="password" name="passPhrase" v-model="pass" placeholder="Pass phrase">
						</div>
					</div>
					<button type="submit" :class="[
							'ui fluid large teal submit button',
							submitting? 'disabled':''
						]">
						Login
					</button>
				</div>
				<div class="ui error message"></div>
			</sform>
			<div class="ui stacked segment">
				<div class="item">
				<router-link to="/register">
					Register
				</router-link>
				</div>
				<div class="item">
				<router-link to="/lost-pw" class="item">
					I lost my pass-phrase
				</router-link>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import user from '@/biz/user';

@Component
export default class Login extends Vue {
	static auth = ['anon'];
	submitting: boolean = false;
	email: string = '';
	pass: string = '';
	formConfig = {
		fields: {
			email: {
				identifier: 'email',
				rules: [{
					type: 'empty',
					prompt: 'Please enter your e-mail address'
				}, {
					type: 'email',
					prompt: 'Please enter a valid e-mail'
				}]
			},
			passPhrase: {
				identifier: 'passPhrase',
				rules: [{
					type: 'empty',
					prompt: 'Please enter your pass phrase'
				}]
			}
		}
	};
	async submit() {
		this.submitting = true;
		try {
			await user.login(this.email, this.pass);
		} catch (e) {
		} finally {
			this.submitting = false;
		}
	}
}
</script>
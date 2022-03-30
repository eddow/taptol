<template>
	<div>
		<h2 class="ui teal header">
			<div class="ui floating content">
				Service
			</div>
		</h2>
		<div class="ui middle aligned center aligned grid" v-if="service">
			<sform class="ui large form" v-if="service" :config="formConfig" @submit="submit">
				<div class="ui stacked segment">
					<div class="fields">
						<div class="six wide field">
							<label for="type">Type</label>
							<dropdown name="type" :values="types" v-model="service.type" />
						</div>
						<div class="four wide field">
							<label for="rate">Rate</label>
							<div class="ui right labeled fluid input">
								<label for="amount" class="ui label">$</label>
								<input type="number" name="rate" v-model="service.rate">
							</div>
						</div>
						<div class="three wide field">
							<label for="startHour">Start hour</label>
							<input type="time" name="startHour" v-model="service.startHourTime">
						</div>
						<div class="three wide field">
							<label for="endHour">End hour</label>
							<input type="time" name="endHour" v-model="service.endHourTime">
						</div>
					</div>
					<h4 class="ui dividing header"><label for="description">Description</label></h4>
					<div class="field">
						<textarea name="description" v-model="service.description"></textarea>
					</div>
					<button type="submit" :class="[
							'ui fluid large teal submit button',
							submitting? 'disabled':''
						]">
						{{submitText}}
					</button>
				</div>
				<div class="ui error message"></div>
			</sform>
		</div>	
	</div>
</template>
<script lang="ts">
import Vue from 'vue';
import {Component, Inject, Model, Prop, Watch, Emit} from 'vue-property-decorator';
import {serviceTypes} from '@obj/service';
import Service from '@/biz/service';

@Component
export default class ServiceEdit extends Vue {
	static auth = ['spec', 'adm'];
	static params = ['svcId'];
	service: Service = null;
	types = serviceTypes
	type: string = '';
	submitting: boolean = false;
	@Prop() svcId: string;
	get submitText(): string {
		return '+'=== this.svcId ? 'Create' : 'Modify';
	}
	async created() {
		this.service = '+'=== this.svcId ?
			new Service() :
			await Service.get(this.svcId);
	}
	formConfig = {
		fields: {
			type: {
				identifier  : 'type',
				rules: [{
					type   : 'empty',
					prompt : 'Please specify the type'
				}]
			},
			rate: {
				identifier  : 'rate',
				rules: [{
					type   : 'empty',
					prompt : 'Please specify the rate'
				}]
			},
			startHour: {
				identifier  : 'startHour',
				rules: [{
					type   : 'empty',
					prompt : 'Please specify the prefered start hour'
				}]
			},
			endHour: {
				identifier  : 'endHour',
				rules: [{
					type   : 'empty',
					prompt : 'Please specify the prefered end hour'
				}]
			},
			description: {
				identifier  : 'description',
				rules: [{
					type   : 'empty',
					prompt : 'Please enter a description'
				}, {
					type   : 'length[20]',
					prompt : "Don't be shy, enhance your description"
				}]
			}
		}
	};
	async submit() {
		this.submitting = true;
		try {
			if('+'=== this.svcId)
				await Service.create(this.service);
			else
				await Service.modify(this.svcId, this.service);
			this.$router.back();
		} catch (e) {
		} finally {
			this.submitting = false;
		}
	}
}
</script>
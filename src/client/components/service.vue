<template>
	<div class="content service-ctl">
		<div class="header">{{serviceName(service.type)}}</div>
		<div class="meta">
			<span class="rate">${{service.rate}}</span>
			<span class="timing">
				From {{service.startHourTime}}
				to {{service.endHourTime}}
			</span>
		</div>
		<div class="description multiline">{{service.description}}</div>
		<div class="extra">
			<slot />
		</div>
	</div>	
</template>
<style lang="scss">
.service-ctl {
	.rate {
		margin-right: 3em;
	}
	.description {
		border: 1px solid gray;
		padding: 1em;
	}
}
</style>
<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import Service from '@/biz/service';
import {serviceTypes} from '@obj/service';

@Component
export default class ServiceView extends Vue {
	@Prop() service: Service;
	
	serviceName(svc: string) {
		return serviceTypes[svc];
	}
}
</script>
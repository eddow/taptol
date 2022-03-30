<template>
	<div class="ui modal">
		<div class="header">{{title}}</div>
		<div class="content">
			<slot>
				{{text}}
			</slot>
		</div>
		<div class="actions">
			<button :class="['ui', del&&'fluid', 'large cancel button']" @click="resolve(false)">
				{{cancel}}
			</button>
			<button type="submit" :class="['ui button', del?'negative':'positive']" @click="resolve(true)">
				{{confirm || (del?'Delete':'Ok')}}
			</button>
		</div>
	</div>
</template>
<script lang="ts">
import Vue from 'vue';
import {Component, Prop, Model, Emit} from 'vue-property-decorator';
import createSemaphore, {Semaphore} from '@/lib/semaphore';

@Component
export default class Confirm extends Vue {
	@Prop() title: string;
	@Prop() text: string;
	@Prop({default: 'Cancel'}) cancel: string;
	@Prop() confirm: string;
	@Prop() del: boolean;
	@Model('set-cb') callback: ()=> Promise<boolean>;
	currentSemaphore: Semaphore<boolean>
	created() {
		this.$emit('set-cb', ()=> {
			$(this.$el)
				.modal('setting', 'closable', false)
				.modal('show');
			return this.currentSemaphore = createSemaphore<boolean>();
		});
	}
	resolve(value: boolean) {
		this.currentSemaphore.resolve(value);;
		this.currentSemaphore = null;
	}
}
</script>
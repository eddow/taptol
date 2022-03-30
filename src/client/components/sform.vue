<template>
	<form>
		<slot />
	</form>
</template>
<style>
</style>
<script lang="ts">
import Vue from 'vue';
import {Component, Prop, Emit} from 'vue-property-decorator';

@Component
export default class SForm extends Vue {
	@Prop() focus: string
	@Prop() config: any
	@Emit() submit() {}
	mounted() {
		let semanticObject = $(this.$el).form(this.config).on('submit', ()=> {
			if(!semanticObject.hasClass('error')) this.submit();
			return false;
		});
		if(this.focus) {
			semanticObject.find(`[name="${this.focus}"]`)[0].focus();
		}
	}
}
</script>
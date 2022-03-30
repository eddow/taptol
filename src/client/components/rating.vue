<template>
	<span>
		<div class="ui yellow rating" data-icon="star" ref="stars"></div>
		<input v-if="name" type="number" style="display: none;"
			:name="name" :value="value" />
	</span>
</template>
<script lang="ts">
import Vue from 'vue';
import {Component, Prop, Model, Watch, Emit} from 'vue-property-decorator';

@Component
export default class Rating extends Vue {
	@Prop() name: string;
	@Prop() readonly: boolean;
	@Prop() clearable: boolean;
	@Model('change') value: number;
	@Emit() change(v: number) {}
	@Watch('value') setRating(v: number) {
		$(this.$refs.stars).rating('set rating', v);
	}
	@Watch('readonly') setReadOnly(v: boolean) {
		$(this.$refs.stars).rating(<any>(v?'disable':'enable'));
	}
	mounted() {
		$(this.$refs.stars).rating({
			initialRating: this.value,
			interactive: !this.readonly,
			maxRating: 5,
			clearable: this.clearable,
			onRate: (v: number)=> {
				this.$emit('change', v);
			}
		});
	}
}
</script>
<template>
	<select :value="value"
			:class="['ui', clearable&&'clearable', 'selection dropdown']"
			:name="name">
		<option v-for="(text, key) in values" :key="key"
			:value="key">{{text}}</option>
	</select>
</template>
<style lang="scss">
#app.mobile .ui.selection.dropdown .menu {
	max-height: 22rem;
}
</style>
<script lang="ts">
import Vue from 'vue';
import {Component, Prop, Model, Emit, Watch} from 'vue-property-decorator';

@Component
export default class Dropdown extends Vue {
	@Prop() name: string;
	@Prop() values: Dictionary<string>;
	@Prop() clearable: boolean;
	@Model('change') value: string;
	@Emit() change(value: string) {}
	
	@Watch('values') refresh() {
		$(this.$el).dropdown('refresh');
	}
	mounted() {
		$(this.$el).dropdown({onChange: this.change.bind(this)});
	}
}
</script>
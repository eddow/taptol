<template>
	<column :row="row" class="collapsing">
		<template v-slot:header>
			<modal @set-cb="confirmDeleteCB" :title="deletionTitle" :del="true">
				{{chosenDeletionText}}
			</modal>
			<button class="ui icon primary button" @click="addNew">
				<icon c="add" />
			</button>
		</template>
		<template v-slot:edit>
			<slot name="edit">
				<slot />
			</slot>
			<button :class="[
				'ui positive icon button',
				modifying? 'disabled':''
			]" @click="raiseSave">
				<icon c="save" />
			</button>
			<button class="ui icon button" @click="cancel">
				<icon c="cancel" />
			</button>
		</template>
		<template v-slot:view>
			<slot name="view">
				<slot />
			</slot>
			<button class="ui icon button" @click="edit">
				<icon c="edit" />
			</button>
			<button :class="[
				'ui negative icon button',
				modifying? 'disabled':''
			]" @click="raiseDel">
				<icon c="delete" />
			</button>
		</template>
	</column>
</template>
<script lang="ts">
import Vue from 'vue';
import {Component, Prop, Inject, InjectReactive} from 'vue-property-decorator';
import Column from './column.vue';

function diff(newV: any, oldV: any) {
	let rv: any = null;
	for(let k in newV)
		if(newV.hasOwnProperty(k) && newV[k]!= oldV[k]) {
			if(!rv) rv = {};
			rv[k] = newV[k];
		}
	return rv;
}

var confirms = new WeakMap<any, (text: string)=> Promise<boolean>>()

@Component({components: {Column}})
export default class EditColumn extends Vue {
	// Object to throw while saving to let the row in edition state
	public static cancelSaveException = {};
	@Prop() row: any;
	@Inject() edition: Map<any, any>;
	@Inject() rkey: string;
	@InjectReactive() data: any[];
	@Prop() deletionTitle: string;
	// We use properties instead of events as we need the return value
	@Prop() save: (id: any, changes: any)=> Promise<void>;
	@Prop() del: (id: any)=> Promise<void>;
	@Prop() deletionText: (row: any)=> string;
	get rid() { return this.row[this.rkey]; }
	get editing() {
		return !!this.edition.get(this.row);
	}
	async raiseSave() {
		this.modifying = true;
		try {
			let edited = this.edition.get(this.row);
			let changes = edited._id?diff(edited, this.row):edited;
			if(changes) {
				let _id = await this.save(this.rid, changes);
				if(!this.row._id) this.$set(this.row, '_id', _id);
				for(let key in changes)
					this.$set(this.row, key, changes[key]);
			}
			this.cancel();
		} catch(x) {
			if(x!== EditColumn.cancelSaveException)
					throw x;
		} finally {
			this.modifying = false;
		}
	}
	cancel() {
		if(!this.rid)   // Delete row if cancel "add"
			this.data.splice(this.data.indexOf(this.row), 1);
		this.edition.delete(this.row);
	}
	@Prop({default: ()=> (()=> ({}))}) create: ()=> any;
	edit() {
		this.edition.set(this.row, Object.assign(this.create(), this.row));
	}
	chosenDeletionText: string = null;
	get confirmDelete(): (text: string)=> Promise<boolean> {
		return confirms.get(this.edition);
	}
	set confirmDelete(v: (text: string)=> Promise<boolean>) {
		confirms.set(this.edition, v);
	}
	confirmDeleteCB(cb: ()=> Promise<boolean>) {
		this.confirmDelete = (row: any)=> {
			this.chosenDeletionText = this.deletionText(row);
			return cb();
		};
	}
	async raiseDel() {
		this.modifying = true;
		try {
			if(await this.confirmDelete(this.row)) {
				await this.del(this.rid);
				let ndx = this.data.indexOf(this.row);
				this.data.splice(ndx, 1);
			}
		} finally {
			this.modifying = false;
		}
	}
	addNew() {
		let row = this.create();
		this.edition.set(row, this.create());
		this.data.push(row);
	}
	modifying: boolean = false;
}
</script>
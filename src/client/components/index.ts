import Vue from 'vue';
import Icon from '@/components/icon.vue';
import Dropdown from '@/components/dropdown.vue';
import SForm from '@/components/sform.vue';
import Modal from '@/components/modal.vue';
import Rating from '@/components/rating.vue';

const comps = {Icon, Dropdown, SForm, Modal, Rating};
for(let comp in comps)
	Vue.component(comp.toLowerCase(), comps[comp]);
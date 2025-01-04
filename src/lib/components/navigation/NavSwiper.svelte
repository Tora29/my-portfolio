<script lang="ts">
	import { onMount } from 'svelte';
	import Swiper from 'swiper';
	import { Navigation, Pagination, Scrollbar } from 'swiper/modules';
	import 'swiper/swiper-bundle.css';

	onMount(() => {
		const swiper = new Swiper('.swiper', {
			modules: [Navigation, Pagination, Scrollbar],
			loop: true,
			slidesPerView: 3,
			spaceBetween: 100,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev'
			},
			scrollbar: {
				el: '.swiper-scrollbar'
			}
		});
	});
</script>

<div class="swiper-container">
	<div class="background-square"></div>
	<div class="swiper w-[1400px]">
		<div class="swiper-wrapper">
			<div class="swiper-slide">
				<a href="/">
					<img src="img/myImage.jpg" alt="AboutMe" />
					<p>ABOUT ME</p>
				</a>
			</div>
			<div class="swiper-slide">
				<a href="/">
					<img src="img/workImage.jpg" alt="Work" />
					<p>WORK</p>
				</a>
			</div>
			<div class="swiper-slide">
				<a href="/">
					<img src="img/historyImage.jpg" alt="History" />
					<p>HISTORY</p>
				</a>
			</div>
			<div class="swiper-slide">
				<a href="/">
					<img src="img/blogImage.jpg" alt="Blog" />
					<p>BLOG</p>
				</a>
			</div>
			<div class="swiper-slide">
				<a href="/">
					<img src="img/contactImage.jpg" alt="Contact" />
					<p>CONTACT</p>
				</a>
			</div>
		</div>
		<div class="swiper-button-prev"></div>
		<div class="swiper-button-next"></div>
	</div>
</div>

<style>
	.background-square {
		opacity: 0.5;
		position: absolute;
		top: 87%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 1400px;
		height: 230px;
		overflow: visible;
		background-color: #6f634c;
		border-radius: 5px;
		z-index: 0;
	}

	.swiper {
		position: relative;
		padding: 0 95px;
		z-index: 1;
	}

	.swiper-slide img {
		width: 100%;
		height: 230px;
		object-fit: cover;
		border-radius: 10px;
		filter: brightness(50%);
	}

	.swiper-slide p {
		position: absolute;
		color: #C7C3BB;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		margin: 0;
		padding: 0;
		font-weight: bold;
		font-size: 2em;
	}

	.swiper-button-prev {
		transform: translateX(100%);
	}

	.swiper-button-next {
		transform: translateX(-100%);
	}

	.swiper-button-prev::before,
	.swiper-button-next::before {
		content: '';
		margin-top: 60px;
		position: absolute;
		top: 0;
		bottom: 0;
		width: 56px;
		height: 56px;
		border: 1px solid #c7c3bb;
		border-radius: 50%;
		box-shadow: 0 0 8px gray;
		background-color: #1c2124;
	}

	.swiper-button-prev::after,
	.swiper-button-next::after {
		content: '';
		margin-top: 130px;
		position: absolute;
		width: 16px;
		height: 16px;
		border-top: 1px solid #c7c3bb;
		border-right: 1px solid #c7c3bb;
	}

	.swiper-button-prev::after {
		transform: rotate(-135deg);
	}

	.swiper-button-next::after {
		transform: rotate(45deg);
	}
</style>

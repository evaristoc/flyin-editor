<svg
	xmlns="http://w3.org"
	viewBox="0 0 400 280"
	width="100%"
	height="100%"
	style="max-width: 450px; display: block; margin: auto;"
>
	<style>
		/* Typography */
		.label-text {
			font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
			font-size: 13px;
			font-weight: 600;
			letter-spacing: 1.5px;
			fill: #334155;
			text-anchor: middle;
		}

		/* Dropzone border pulse when file hovers over */
		.dropzone-inner {
			animation: zoneHighlight 3.5s ease-in-out infinite;
		}

		/* Cloud icon subtle bounce on drop */
		.cloud-icon {
			transform-origin: 200px 140px;
			animation: cloudBounce 3.5s ease-in-out infinite;
		}

		/* Dragged file + hand movement */
		.drag-group {
			animation: dragAction 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
		}

		/* Dotted motion trail */
		.motion-trail {
			stroke-dasharray: 4 4;
			animation: trailFade 3.5s ease-in-out infinite;
		}

		@keyframes dragAction {
			0% {
				transform: translate(0px, 0px) rotate(-6deg);
				opacity: 0;
			}
			15% {
				transform: translate(0px, 0px) rotate(-6deg);
				opacity: 1;
			}
			55% {
				transform: translate(75px, 48px) rotate(0deg) scale(1);
				opacity: 1;
			}
			70% {
				transform: translate(75px, 52px) rotate(0deg) scale(0.85);
				opacity: 0;
			}
			100% {
				transform: translate(0px, 0px) rotate(-6deg);
				opacity: 0;
			}
		}

		@keyframes zoneHighlight {
			0%,
			35% {
				stroke: #64748b;
				fill: #f8fafc;
			}
			50%,
			70% {
				stroke: #3b82f6;
				fill: #eff6ff;
			}
			85%,
			100% {
				stroke: #64748b;
				fill: #f8fafc;
			}
		}

		@keyframes cloudBounce {
			0%,
			55% {
				transform: scale(1);
				stroke: #475569;
			}
			65% {
				transform: scale(1.15);
				stroke: #3b82f6;
			}
			75%,
			100% {
				transform: scale(1);
				stroke: #475569;
			}
		}

		@keyframes trailFade {
			0%,
			15% {
				opacity: 0;
			}
			35%,
			55% {
				opacity: 0.8;
			}
			70%,
			100% {
				opacity: 0;
			}
		}
	</style>

	<!-- Outer Sketchy Frame -->
	<rect
		x="85"
		y="75"
		width="230"
		height="130"
		rx="16"
		fill="none"
		stroke="#334155"
		stroke-width="2"
	/>

	<!-- Inner Dashed Drop Region -->
	<rect
		class="dropzone-inner"
		x="93"
		y="83"
		width="214"
		height="114"
		rx="11"
		fill="#f8fafc"
		stroke="#64748b"
		stroke-width="1.8"
		stroke-dasharray="6 6"
	/>

	<!-- Center Cloud Upload Icon -->
	<g
		class="cloud-icon"
		fill="none"
		stroke="#475569"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path
			d="M 182 152 H 218 A 12 12 0 0 0 216 128 A 16 16 0 0 0 185 125 A 13 13 0 0 0 182 152 Z"
			fill="#ffffff"
		/>
		<path d="M 200 146 V 132" />
		<path d="M 195 137 L 200 132 L 205 137" />
	</g>

	<!-- Curved Motion Guide Arrow -->
	<g class="motion-trail" fill="none" stroke="#3b82f6" stroke-width="1.8" stroke-linecap="round">
		<path d="M 145 55 Q 185 60 198 98" />
		<path d="M 192 94 L 198 99 L 202 92" stroke-dasharray="none" />
	</g>

	<!-- Dragged File & Pointer Hand Group -->
	<g class="drag-group">
		<!-- Document / File Icon -->
		<g transform="translate(95, 25)">
			<!-- Main Page Body with Folded Corner -->
			<path
				d="M 0 4 Q 0 0 4 0 H 28 L 40 12 V 48 Q 40 52 36 52 H 4 Q 0 52 0 48 Z"
				fill="#e0f2fe"
				stroke="#1e293b"
				stroke-width="2"
				stroke-linejoin="round"
			/>
			<!-- Folded Corner Flap -->
			<path
				d="M 28 0 V 12 H 40"
				fill="#bae6fd"
				stroke="#1e293b"
				stroke-width="2"
				stroke-linejoin="round"
			/>
			<!-- Sketchy Text Lines -->
			<line
				x1="8"
				y1="22"
				x2="26"
				y2="22"
				stroke="#1e293b"
				stroke-width="2"
				stroke-linecap="round"
			/>
			<line
				x1="8"
				y1="30"
				x2="32"
				y2="30"
				stroke="#1e293b"
				stroke-width="2"
				stroke-linecap="round"
			/>
			<line
				x1="8"
				y1="38"
				x2="22"
				y2="38"
				stroke="#1e293b"
				stroke-width="2"
				stroke-linecap="round"
			/>
		</g>

		<!-- Sketchy Pointer Hand Icon -->
		<g
			transform="translate(122, 62)"
			fill="#ffffff"
			stroke="#1e293b"
			stroke-width="1.8"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path
				d="M 6 12 V 3 A 2.5 2.5 0 0 1 11 3 V 10 
               A 2.5 2.5 0 0 1 16 10 V 11 
               A 2.5 2.5 0 0 1 21 11 V 12 
               A 2.5 2.5 0 0 1 25 13 V 21 
               C 25 26 21 29 15 29 H 11 
               C 6 29 4 25 2 21 L 0 17 
               A 2.2 2.2 0 0 1 3.5 14.5 L 6 17 Z"
			/>
		</g>
	</g>

	<!-- Bottom Label -->
	<text x="200" y="232" class="label-text">DROP FILES HERE</text>
</svg>

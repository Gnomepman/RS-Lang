export const animation = ` 
<svg class="animation" width="70" height="70">
  <rect
    id="rect1"
    x="0"
    y="0"
    width="20"
    height="20"
    stroke="black"
    fill="black"
    stroke-width="2"
  />
  <rect
    id="rect2"
    x="0"
    y="0"
    width="20"
    height="20"
    stroke="black"
    fill="black"
    stroke-width="2"
  />
  <rect
    id="rect3"
    x="0"
    y="0"
    width="20"
    height="20"
    stroke="black"
    fill="black"
    stroke-width="2"
  />
  <rect
    id="rect4"
    x="0"
    y="0"
    width="20"
    height="20"
    stroke="black"
    fill="black"
    stroke-width="2"
  />
  <path
    id="path1"
    d="M5,5 L45,5 L45,45 L5,45 Z"
    fill="none"
    stroke="transparent"
    stroke-width="2"
  />
  <animateMotion href="#rect1" dur="2s" repeatCount="indefinite">
    <mpath href="#path1" />
  </animateMotion>
  <path
    id="path2"
    d="M45,5 L45,45 L5,45 L5,5 Z"
    fill="none"
    stroke="transparent"
    stroke-width="2"
  />
  <animateMotion href="#rect2" dur="2s" repeatCount="indefinite">
    <mpath href="#path2" />
  </animateMotion>
  <path
    id="path3"
    d="M45,45 L5,45 L5,5 L45,5 Z"
    fill="none"
    stroke="transparent"
    stroke-width="2"
  />
  <animateMotion href="#rect3" dur="2s" repeatCount="indefinite">
    <mpath href="#path3" />
  </animateMotion>
  <path
    id="path4"
    d="M5,45 L5,5 L45,5 L45,45 Z"
    fill="none"
    stroke="transparent"
    stroke-width="2"
  />
  <animateMotion href="#rect4" dur="2s" repeatCount="indefinite">
    <mpath href="#path4" />
  </animateMotion>
</svg>`;

import { makeRem, makeColor } from "@buttery/studio-tokens";
import type { LinariaClassName } from "@linaria/core";
import { css } from "@linaria/core";

import type { ModalType } from "./Modal";

const drawerStyles = css`
  --drawer-width: 0;

  &.s {
    &-sm {
      --drawer-width: 20%;
      width: var(--drawer-width);
    }
    &-md {
      --drawer-width: 40%;
      width: var(--drawer-width);
    }
    &-lg {
      --drawer-width: 60%;
      width: var(--drawer-width);
    }
    &-xl {
      --drawer-width: 80%;
      width: var(--drawer-width);
    }
  }

  padding: 0;
  border: 0;
  transition: backdrop-filter 1s ease;
  margin: 0;
  border: 0;

  &::backdrop {
    transition: backdrop-filter 1s ease;
    backdrop-filter: blur(10px);
    background: rgba(0, 0, 0, 0.4);
  }

  @keyframes fade-in {
    0% {
      opacity: 0;
      visibility: hidden;
    }
    100% {
      opacity: 1;
      visibility: visible;
    }
  }

  @keyframes fade-out {
    0% {
      opacity: 1;
      visibility: visible;
    }
    100% {
      opacity: 0;
      visibility: hidden;
    }
  }

  &.v-right-to-left {
    @keyframes rtl-open {
      0% {
        opacity: 0;
        transform: translateX(100%);
      }
      100% {
        opacity: 1;
        transform: translateX(--drawer-width);
      }
    }

    @keyframes rtl-close {
      0% {
        opacity: 1;
        transform: translateX(--drawer-width);
      }
      100% {
        opacity: 0;
        transform: translateX(100%);
      }
    }

    left: calc(100% - var(--drawer-width));
    right: 0;
    height: 100%;
    max-height: 100%;
    position: fixed;
    border-top-left-radius: ${makeRem(4)};
    border-bottom-left-radius: ${makeRem(4)};

    @media (prefers-reduced-motion: no-preference) {
      &[open] {
        animation: rtl-open 0.2s ease-in-out forwards;
        &::backdrop {
          animation: fade-in 0.2s ease-in-out forwards;
        }
      }
      &[data-close="true"] {
        animation: rtl-close 0.2s ease-in-out forwards;
        &::backdrop {
          animation: fade-out 0.2s ease-in-out forwards;
        }
      }
    }
  }
`;

const defaultStyles = css`
  padding: 0;
  border: 0;
  margin: 0;
  margin: auto;
  border-radius: ${makeRem(4)};
  transition: backdrop-filter 1s ease;
  filter: ${` drop-shadow(1px 2px 20px ${makeColor("neutral", {
    opacity: 0.5,
  })})`};

  &.v {
    &-contain {
      display: grid;
      grid-template-rows: auto 1fr auto;
      height: 100%;
    }
  }

  &.s {
    &-sm {
      width: 20%;
    }
    &-md {
      width: 40%;
    }
    &-lg {
      width: 60%;
    }
    &-xl {
      width: 80%;
    }
    &-full {
      width: 100%;
      height: 100%;
    }
  }

  &::backdrop {
    transition: backdrop-filter 1s ease;
    /* backdrop-filter: blur(10px); */
    background: ${makeColor("neutral-dark", { opacity: 0.5 })};
  }

  /* Animation for appearing */
  @keyframes appear {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Animation for disappearing */
  @keyframes disappear {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.9);
    }
  }

  @keyframes fade-in {
    0% {
      opacity: 0;
      visibility: hidden;
    }
    100% {
      opacity: 1;
      visibility: visible;
    }
  }

  @keyframes fade-out {
    0% {
      opacity: 1;
      visibility: visible;
    }
    100% {
      opacity: 0;
      visibility: hidden;
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    &[open] {
      animation: appear 0.35s ease-in-out forwards;
      &::backdrop {
        animation: fade-in 0.35s ease-in-out forwards;
      }
    }
    &[data-close="true"] {
      animation: disappear 0.35s ease-in-out forwards;
      &::backdrop {
        animation: fade-out 0.35s ease-in-out forwards;
      }
    }
  }
`;

export const modalStyles: { [key in ModalType]: LinariaClassName } = {
  default: defaultStyles,
  drawer: drawerStyles,
};

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './welcome-component.js';

const meta: Meta = {
  title: 'Components/WelcomeComponent',
  component: 'welcome-component',
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Name to display in the greeting',
    },
  },
  render: (args) => html`<welcome-component .name=${args.name}></welcome-component>`,
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {
    name: 'World',
  },
};

export const CustomName: Story = {
  args: {
    name: 'Storybook',
  },
};

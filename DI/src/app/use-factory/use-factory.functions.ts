import { GreetingConfig } from './use-factory.modal';

export function greetingConfigFactory(): GreetingConfig {
  const currentHour = new Date().getHours();
  let greetingMessage: string;
  if (currentHour < 12) {
    greetingMessage = 'Good Morning';
  } else if (currentHour < 18) {
    greetingMessage = 'Good Afternoon';
  } else {
    greetingMessage = 'Good Evening';
  }

  return { greetingMessage };
}

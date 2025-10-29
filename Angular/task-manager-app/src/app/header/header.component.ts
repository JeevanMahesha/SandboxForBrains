import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="navbar">
      <div class="container">
        <div class="navbar-brand">
          <a routerLink="/" class="logo">Task Manager</a>
        </div>
        <nav class="navbar-links">
          <ul>
            <li><a routerLink="/">Tasks</a></li>
            <li>
              <a routerLink="/about">About</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  `,
  styles: `
  .navbar {
  background-color: #007bff;
  color: white;
  padding: 10px 0;

  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .navbar-brand {
      .logo {
        color: white;
        font-size: 1.5rem;
        text-decoration: none;
        font-weight: bold;
        padding: 10px;
        &:hover {
          text-decoration: none;
        }
      }
    }

    .navbar-links {
      ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        display: flex;

        li {
          margin-right: 20px;

          a {
            color: white;
            text-decoration: none;
            font-size: 1rem;
            padding: 10px;
            transition: background-color 0.3s;

            &:hover,
            &.active {
              background-color: rgba(255, 255, 255, 0.1);
              border-radius: 5px;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .navbar {
    .container {
      flex-direction: column;

      .navbar-links {
        ul {
          flex-direction: column;
          align-items: center;
          margin-top: 10px;

          li {
            margin-right: 0;
            margin-bottom: 10px;

            a {
              padding: 8px 15px;
            }
          }
        }
      }
    }
  }
}

  `,
})
export class HeaderComponent {}

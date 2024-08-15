import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface User {
  id: number;
  emailId: string;
  first_name: string;
  last_name: string;
  level: number;
}

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent {
  users: User[] = []; // Initialize with an empty array or fetch from a service

  addUser() {
    // Logic for adding a user
    console.log('Add User clicked');
    // You might want to implement a form to capture user details and push to users array
  }

  editUser(userId: number) {
    // Logic for editing a user by userId
    console.log('Edit User:', userId);
    // Implement logic to find the user and edit their details
  }

  deleteUser(userId: number) {
    // Logic for deleting a user by userId
    console.log('Delete User:', userId);
    this.users = this.users.filter(user => user.id !== userId); // Example logic
  }
}

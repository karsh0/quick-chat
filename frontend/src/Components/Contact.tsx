interface User {
    username: string;
    roomId: string;
  }
  
  export function Contact({ selectedUser }: { selectedUser: User | null }) {
    return (
      <div>
        <h2>{selectedUser ? selectedUser.username : "No user selected"}</h2>
      </div>
    );
  }
  
import React, { useState } from "react";

const UserDropdown = ({ users }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShow(!show)}
        className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        People
      </button>

      {show && (
        <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg w-48 z-10">
          {users.length === 0 ? (
            <p className="p-2 text-sm text-gray-500">No users</p>
          ) : (
            users.map((user, index) => (
              <div key={index} className="p-2 text-sm hover:bg-gray-100">
                {user.username}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default UserDropdown;

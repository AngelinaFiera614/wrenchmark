
import React from 'react';

export const AdminRidingSkillsEmpty: React.FC = () => {
  return (
    <div className="border rounded-md p-8 text-center">
      <p className="text-muted-foreground">
        No riding skills have been created yet. Add your first skill using the button above.
      </p>
    </div>
  );
};

import React from 'react';
import {XIcon} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {Dialog, DialogClose, DialogContent} from '@/components/ui/dialog';
import {RcPerson} from '@/lib/api';
import Profile from '@/components/Profile';

export const ProfileDialog = ({
  open,
  person,
  onClose,
}: {
  open?: boolean;
  person: RcPerson | null;
  onClose: () => void;
}) => {
  return (
    <Dialog open={open}>
      <DialogContent className="max-h-[90vh] gap-4 overflow-auto sm:max-w-xl">
        <div className="flex justify-end">
          <DialogClose asChild>
            <Button
              className="absolute right-2 top-2"
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </DialogClose>
        </div>
        {!!person && <Profile className="" person={person} />}
      </DialogContent>
    </Dialog>
  );
};

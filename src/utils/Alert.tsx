import Swal from 'sweetalert2';
import { DangerRight } from '../api/toastServices';

export const warning = (confirm: any) => {
  return Swal.fire({
    title: 'Are you sure?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3b436f',
    cancelButtonColor: '#777777 ',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  });
};

// Delete Warning for category
export const warningForText = (title: any, text: any) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: '#3b436f',
    cancelButtonColor: '#777777 ',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  });
};


import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export const showAlert = {
  success: (title: string, text?: string) => {
    return MySwal.fire({
      icon: 'success',
      title,
      text,
      timer: 3000,
      showConfirmButton: false,
      position: 'center',
    })
  },
  error: (title: string, text?: string) => {
    return MySwal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonText: 'OK',
      confirmButtonColor: '#d33',
    })
  },
  warning: (title: string, text?: string) => {
    return MySwal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonText: 'OK',
    })
  },
  confirm: (title: string, text: string) => {
    return MySwal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    })
  },
}

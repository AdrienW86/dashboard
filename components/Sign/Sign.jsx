import { useForm } from 'react-hook-form';
import { useState } from 'react'
import styles from './sign.module.css'

export default function Sign() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await fetch('/api/sign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('User created:', responseData);
        alert('Votre compte a bien été crée')
      } else {
        const errorMessage = await response.text();
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Error creating user:', error.message);
      setError('Une erreur s\'est produite lors de la création de l\'utilisateur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className={styles.main}>                     
        <section className={styles.modal}>
        <h1 className={styles.title}> Incrivez vous </h1>
          <p className={styles.title}> et commencez à générer vos documents</p>
          <form className={styles.signForm} onSubmit={handleSubmit(onSubmit)}>
            <label className={styles.label}>
              Email:
            </label>
            <input
              type="email"
              name="email"
              {...register('email', { required: 'Email requis' })}
            />
            {errors.email && <p className={styles.error}>{errors.email.message}</p>}
            <br />
            <label className={styles.label}>
              Mot de passe:
            </label>
            <input
              type="password"
              name="password"
              {...register('password', { required: 'Mot de passe requis' })}
            />
            {errors.password && <p className={styles.error}>{errors.password.message}</p>}
            <br />           
            <button
              disabled={loading}
              className={styles.link}
              type="submit"
            >
              {loading ? 'Chargement...' : 'S\'inscrire'}
            </button>
          </form>           
        </section>                                                          
      </main>
    </>
  )
}
import React from 'react';
import { useForm } from 'react-hook-form';

export default function RoutineQuiz({ onQuizSubmit }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    onQuizSubmit(data);
  };

  // Helper component for styling form sections
  const FormSection = ({ title, emoji, children }) => (
    <div className="border-t border-brand-pink pt-6 mt-6">
      <h3 className="text-xl font-semibold text-brand-pink-dark mb-4 flex items-center">
        <span className="text-2xl mr-2">{emoji}</span> {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );

  // Helper component for radio/checkbox inputs
  const InputOption = ({ name, type, label, value, register, rules }) => (
    <label className="flex items-center p-3 bg-brand-pink-light border border-brand-pink rounded-lg hover:bg-brand-pink transition-colors">
      <input 
        type={type} 
        value={value || label} 
        {...register(name, rules)} 
        className={`mr-3 ${type === 'radio' ? 'form-radio' : 'form-checkbox'} text-brand-pink-dark focus:ring-brand-pink-dark`}
      />
      {label}
    </label>
  );

  return (
    <div>
      <h2 className="text-3xl font-bold text-center text-brand-pink-dark mb-6">Find Your Perfect Routine</h2>
      <p className="text-center text-brand-text-light mb-6">Fill out this quick form so our AI can build a routine just for you.</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-brand-text-light mb-1">Gender</label>
            <select {...register('gender')} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-pink">
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
          <div>
            <label className="block text-brand-text-light mb-1">Age</label>
            <input type="number" {...register('age', { required: 'Age is required' })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-pink" />
            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
          </div>
        </div>

        {/* Skin Type */}
        <FormSection title="Skin Type" emoji="💧">
          <p className="text-brand-text-light md:col-span-2">(Choose one or more that fit best)</p>
          <InputOption name="skinType" type="checkbox" label="Oily" register={register} rules={{ required: "Please select at least one skin type" }} />
          <InputOption name="skinType" type="checkbox" label="Dry" register={register} rules={{ required: "Please select at least one skin type" }} />
          <InputOption name="skinType" type="checkbox" label="Normal" register={register} rules={{ required: "Please select at least one skin type" }} />
          <InputOption name="skinType" type="checkbox" label="Combination" register={register} rules={{ required: "Please select at least one skin type" }} />
          <InputOption name="skinType" type="checkbox" label="Sensitive" register={register} rules={{ required: "Please select at least one skin type" }} />
          <InputOption name="skinType" type="checkbox" label="Acne-prone" register={register} rules={{ required: "Please select at least one skin type" }} />
          {errors.skinType && <p className="text-red-500 text-sm md:col-span-2">{errors.skinType.message}</p>}
        </FormSection>

        {/* Skin Concerns */}
        <FormSection title="Current Skin Concerns" emoji="🧴">
          <p className="text-brand-text-light md:col-span-2">(Select all that apply)</p>
          <InputOption name="concerns" type="checkbox" label="Acne / Pimples" register={register} />
          <InputOption name="concerns" type="checkbox" label="Blackheads / Whiteheads" register={register} />
          <InputOption name="concerns" type="checkbox" label="Dullness / Uneven tone" register={register} />
          <InputOption name="concerns" type="checkbox" label="Dark spots / Pigmentation" register={register} />
          <InputOption name="concerns" type="checkbox" label="Redness / Sensitivity" register={register} />
          <InputOption name="concerns" type="checkbox" label="Dry patches / Flakiness" register={register} />
          <InputOption name="concerns" type="checkbox" label="Wrinkles / Fine lines" register={register} />
        </FormSection>

        {/* Lifestyle */}
        <FormSection title="Lifestyle & Habits" emoji="🌞">
          <div className="md:col-span-2">
            <label className="block text-brand-text-light mb-2">How many hours are you exposed to sunlight daily?</label>
            <InputOption name="sunlight" type="radio" value="< 1 hour" label="< 1 hour" register={register} rules={{ required: true }} />
            <InputOption name="sunlight" type="radio" value="1-3 hours" label="1-3 hours" register={register} rules={{ required: true }} />
            <InputOption name="sunlight" type="radio" value="3-6 hours" label="3-6 hours" register={register} rules={{ required: true }} />
            <InputOption name="sunlight" type="radio" value="> 6 hours" label="> 6 hours" register={register} rules={{ required: true }} />
          </div>
          <div>
            <label className="block text-brand-text-light mb-2">Do you regularly wear sunscreen?</label>
            <InputOption name="sunscreen" type="radio" value="Yes" label="Yes" register={register} rules={{ required: true }} />
            <InputOption name="sunscreen" type="radio" value="No" label="No" register={register} rules={{ required: true }} />
          </div>
          <div>
            <label className="block text-brand-text-light mb-2">How much water do you drink daily?</label>
            <InputOption name="water" type="radio" value="< 1L" label="< 1L" register={register} rules={{ required: true }} />
            <InputOption name="water" type="radio" value="1-2L" label="1-2L" register={register} rules={{ required: true }} />
            <InputOption name="water" type="radio" value="2-3L" label="2-3L" register={register} rules={{ required: true }} />
            <InputOption name="water" type="radio" value="> 3L" label="> 3L" register={register} rules={{ required: true }} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-brand-text-light mb-2">How often do you exercise or sweat heavily?</label>
            <InputOption name="exercise" type="radio" value="Rarely" label="Rarely" register={register} rules={{ required: true }} />
            <InputOption name="exercise" type="radio" value="2-3 times a week" label="2-3 times a week" register={register} rules={{ required: true }} />
            <InputOption name="exercise" type="radio" value="Daily" label="Daily" register={register} rules={{ required: true }} />
          </div>
        </FormSection>
        
        {/* Current Routine */}
        <FormSection title="Current Routine" emoji="💤">
          <div>
            <label className="block text-brand-text-light mb-2">How often do you wash your face?</label>
            <InputOption name="faceWash" type="radio" value="Once a day" label="Once a day" register={register} rules={{ required: true }} />
            <InputOption name="faceWash" type="radio" value="Twice a day" label="Twice a day" register={register} rules={{ required: true }} />
            <InputOption name="faceWash" type="radio" value="More than twice" label="More than twice" register={register} rules={{ required: true }} />
          </div>
          <div>
            <label className="block text-brand-text-light mb-2">Do you use moisturizer?</label>
            <InputOption name="moisturizer" type="radio" value="Yes" label="Yes" register={register} rules={{ required: true }} />
            <InputOption name="moisturizer" type="radio" value="No" label="No" register={register} rules={{ required: true }} />
          </div>
          <div>
            <label className="block text-brand-text-light mb-2">Do you exfoliate?</label>
            <InputOption name="exfoliate" type="radio" value="Weekly" label="Weekly" register={register} rules={{ required: true }} />
            <InputOption name="exfoliate" type="radio" value="Rarely" label="Rarely" register={register} rules={{ required: true }} />
            <InputOption name="exfoliate" type="radio" value="Never" label="Never" register={register} rules={{ required: true }} />
          </div>
          <div>
            <label className="block text-brand-text-light mb-2">Do you use makeup daily?</label>
            <InputOption name="makeup" type="radio" value="Yes" label="Yes" register={register} rules={{ required: true }} />
            <InputOption name="makeup" type="radio" value="No" label="No" register={register} rules={{ required: true }} />
          </div>
        </FormSection>
        
        {/* Medical Background */}
        <FormSection title="Medical Background" emoji="⚕️">
          <div className="md:col-span-2">
            <label className="block text-brand-text-light mb-1">Any known allergies or skin reactions? (Optional)</label>
            <input {...register('allergies')} placeholder="e.g., fragrance, specific acids" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-pink" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-brand-text-light mb-1">Are you under any medication? (Optional)</label>
            <input {...register('medication')} placeholder="e.g., acne medication, etc." className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-pink" />
          </div>
        </FormSection>

        <button type="submit" className="w-full mt-8 bg-brand-pink-dark text-white py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity">
          Generate My Routine
        </button>
      </form>
    </div>
  );
}